const log = (i) => alert(JSON.stringify(i));

const HOST = "https://wixonic.github.io/insomnyak";

const doc = {
	head: document.head,
	body: document.body,
	
	id: (i) => document.getElementById(i),
	class: (c) => document.getElementsByClassName(c),
	tag: (t) => document.getElementsByTagName(t)
};

const random = (M=1,m=0) => Math.random() * (M - m) + m;

const Clan = Object.freeze({
	grade: Object.freeze({
		m: ["Banni","Membre","Aîné","Guerrier","Caporal","Adjudant","Colonel","Général","Adjoint","Leader"],
		f: ["Bannie","Membre","Aînée","Guerrière","Caporale","Adjudante","Colonelle","Générale","Adjointe","Leadeuse"]
	}),
	
	members: (obj) =>
	{
		return new Promise((r) =>
		{
			window.database
			.doc("members")
			.get()
			.then((snapshot) =>
			{
				if (!snapshot.empty)
				{
					const members = snapshot.data();
					
					if (!obj)
					{
						let membersSorted = [];
							
						for (let i = Clan.grade.m.length; i >= 0; --i)
						{
							for (let m in members)
							{
								if (members[m].grade == i)
								{
									membersSorted.length > 0 ? membersSorted.push(members[m]) : membersSorted = [members[m]];
								}
							}
						}
						
						r(membersSorted);
					} else {
						r(members);
					}
				} else {
					r();
				}
			});
		});
	},
	
	news: () =>
	{
		return new Promise((r) =>
		{
			window.database
			.doc("news")
			.get()
			.then((snapshot) =>
			{
				if (!snapshot.empty)
				{
					r(snapshot.data());
				} else {
					r();
				}
			});
		});
	}
});

onload = () =>
{
	try
	{
		firebase.initializeApp({
			apiKey: "AIzaSyCKJ9OS8cztMBtOzF8LgKGbGcH9mwiIgrY",
			authDomain: "wixonic-insomnyak.firebaseapp.com",
			projectId: "wixonic-insomnyak",
			storageBucket: "wixonic-insomnyak.appspot.com",
			messagingSenderId: "1167014093",
			appId: "1:1167014093:web:7d0b19045725507ef81184"
		});
	} catch {}
	
	try
	{
		window.database = firebase.firestore().collection("main");
	} catch {}
	
	try
	{
		doc.tag("header")[0].innerHTML = `<a href="${HOST}/" class="fas fa-home"></a><b>INSOMNYAЖ</b><empty></empty>`;
	} catch {}
	
	try
	{
		init();
	} catch {}
};
