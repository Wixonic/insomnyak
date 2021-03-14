window.onerror = alert;

const connect = () =>
{
	const username = doc.id("username").value;
	const password = btoa(doc.id("password-id").value);

	window.database
	.doc("users")
	.get()
	.then((snapshot) => {
		if (!snapshot.empty)
		{
			const user = snapshot.data()[username];
			
			if (user && user.password === password)
			{
				window.user = user;
				window.uid = user.id;
				doc.id("error").innerHTML = "";
				Clan.members(true)
				.then((members) =>
				{
					window.member = members[window.uid];
					
					doc.id("name").value = window.member.username || "";
					doc.id("grade").innerText = (window.member.genre ? Clan.grade.f : Clan.grade.m)[window.member.grade];
					doc.id("email").value = window.member.email || "";
					doc.id("password").value = atob(window.user.password) || "";

					doc.id("form").style.display = "none";
					doc.id("overview").style.display = "block";
					if (!window.user.rights.news)
					{
						doc.id('newnews-btn').remove();
					}
					
					if (!window.user.rights.recruit)
					{
						doc.id("recruit-btn").remove();
					}
				});
			} else {
				doc.id("error").innerHTML = "Incorrect username or password";
			}
		}
	});
};


const getMembers = () =>
{
	Clan.members()
	.then((members) =>
	{
		if (members.length > 0)
		{
			doc.id("members-cont").innerHTML = "";
			
			for (let i in members)
			{
				if (i !== "length")
				{
					const member = members[i];
					const grade = member.genre ? Clan.grade.f[member.grade] : Clan.grade.m[member.grade];
					
					doc.id("members-cont").innerHTML += `<div onclick="alreadyMember(${member.id});" class="member" grade="${member.grade}"><div class="username">${member.username || "Anonyme"}</div><div class="grade">${grade || Clan.grade.m[1]}</div></div>`;
				}
			}
		} else {
			doc.id("members-cont").innerHTML = `<b>An error occured</b><br />We can't find members`;
		}
	}).catch((e) => {
		doc.id("members-cont").innerHTML = `<b>An error occured</b><br />${e}`;
	});
};


const getNews = () =>
{
	Clan.news()
	.then((news) =>
	{
		if (news.length > 0)
		{
			doc.id("news-cont").innerHTML = "";
			
			for (let i in news)
			{
				if (i !== "length")
				{
					const n = news[i];
					
					doc.id("news-cont").innerHTML += `<div class="new"><div class="title">${n.title}</div><div class="description">${n.description}</div></div>`;
				}
			}
		}
	}).catch((e) => {
		doc.id("news-cont").innerHTML = `<b>An error occured</b><br />${e}`;
	});
};


const changeName = (name) =>
{
	if (typeof(name) == "string" && name.length > 0 && name != window.member.username)
	{
		const lastName = window.member.username;
		window.member.username = name;

		const datasM = {};
		const datasU = {};

		datasM[window.member.id] = window.member;
		datasU[lastName] = {};
		datasU[window.member.username] = window.user;

		window.database
		.doc("members")
		.update(datasM)
		.then(() => {
	    	window.database
			.doc("users")
			.update(datasU)
			.then(() => {
	    		doc.id("nameLog-text").innerHTML = "Nom correctement mis à jour";
	    		doc.id("nameLog").classList.remove("error");
	    		doc.id("nameLog").style.display = "inline-block";
			})
			.catch((e) => {
				doc.id("nameLog-text").innerHTML = "Une erreur est survenue";
				doc.id("nameLog").classList.add("error");
				doc.id("nameLog").style.display = "inline-block";
				console.log(e);
			});
		})
		.catch((e) => {
			doc.id("nameLog-text").innerHTML = "Une erreur est survenue";
			doc.id("nameLog").classList.add("error");
			doc.id("nameLog").style.display = "inline-block";
			console.log(e);
		});
	}
};

const changeEmail = (email) =>
{
	if (typeof(email) == "string" && email.length > 0 && email != window.member.email)
	{
		window.member.email = email;

		const datas = {};

		datas[window.member.id] = window.member;

		window.database
		.doc("members")
		.update(datas)
		.then(() => {
	    	doc.id("emailLog-text").innerHTML = "Email correctement mis à jour";
	    	doc.id("emailLog").classList.remove("error");
	    	doc.id("emailLog").style.display = "inline-block";
		})
		.catch((e) => {
			doc.id("emailLog-text").innerHTML = "Une erreur est survenue";
			doc.id("emailLog").classList.add("error");
			doc.id("emailLog").style.display = "inline-block";
			console.log(e);
		});
	}
};

const changePassword = (password) =>
{
	if (typeof(password) == "string" && password.length > 0 && btoa(password) != window.user.password)
	{
		window.user.password = btoa(password);

		const datas = {};

		datas[window.member.username] = window.user;

		window.database
		.doc("users")
		.update(datas)
		.then(() => {
	    	doc.id("passwordLog-text").innerHTML = "Mot de passe correctement mis à jour";
	    	doc.id("passwordLog").classList.remove("error");
	    	doc.id("passwordLog").style.display = "inline-block";
		})
		.catch((e) => {
			doc.id("passwordLog-text").innerHTML = "Une erreur est survenue";
			doc.id("passwordLog").classList.add("error");
			doc.id("passwordLog").style.display = "inline-block";
			console.log(e);
		});
	}
};

const updateMember = (id,username,grade,genre,email,rights) =>
{
	return new Promise((r) =>
	{
		Clan.members(true)
		.then((members) =>
		{
			window.database
			.doc("users")
			.get()
			.then((snapshot) =>
			{
				const users = snapshot.data();
				
				if (!members[id] || !users[username])
				{
					const password = Math.floor(random(9999,1000));
					
					alert(`Mot de passe temporaire de l'utilisateur : ${password}.`);
					
					users[username] = {
						id: id,
						password: btoa(password)
					};
				}
				
				users[username].rights = {
					banish: rights.banish,
					news: rights.news,
					promote: rights.promote,
					recruit: rights.recruit
				};
				
				members[id] = {
					username: username,
					grade: grade,
					genre: genre,
					email: email,
					id: id,
					recruited: window.member.id
				};
				
				window.database
				.doc("users")
				.update(users)
				.then(() =>
				{
					window.database
					.doc("members")
					.update(members)
					.then(() =>
					{
						getMembers();
						
						doc.id("members-editor").style.display = "none";
						doc.id("members").style.display = "block";
					}).catch(e => alert(e + " in users"));
				}).catch(e => alert(e + " in members"));
			});
		});
	});
};


const memberReset = () =>
{
	doc.id("members-editor-username").removeAttribute("disabled");
	doc.id("members-editor-genre").removeAttribute("disabled");
	doc.id("members-editor-email").removeAttribute("disabled");

	doc.id("members-editor-rights-banish").removeAttribute("disabled");
	doc.id("members-editor-rights-news").removeAttribute("disabled");
	doc.id("members-editor-rights-promote").removeAttribute("disabled");
	doc.id("members-editor-rights-recruit").removeAttribute("disabled");
};

const newMember = () =>
{
	memberReset();
	
	Clan.members()
	.then((members) =>
	{
		doc.id("members-editor-id").value = members.length;
		
		for (let i in Clan.grade.m)
		{
			doc.id("members-editor-grade").innerHTML += `<option ${i == 1 ? "selected" : ""} value="${i}">${Clan.grade.m[i]}</option>`;
		}

		if (!window.user.rights.banish)
		{
			doc.id("members-editor-rights-banish").setAttribute("disabled","true");
		}

		if (!window.user.rights.news)
		{
			doc.id("members-editor-rights-news").setAttribute("disabled","true");
		}

		if (!window.user.rights.promote)
		{
			doc.id("members-editor-rights-promote").setAttribute("disabled","true");
		}

		if (!window.user.rights.recruit)
		{
			doc.id("members-editor-rights-recruit").setAttribute("disabled","true");
		}
		
		doc.id("members").style.display = "none";
		doc.id("members-editor").style.display = "block";
	});
};

const alreadyMember = (id) =>
{
	const security = 8;
	
	Clan.members(true)
	.then((members) =>
	{
		window.database
		.doc("users")
		.get()
		.then((snapshot) =>
		{
			const user = snapshot.data()[members[id].username];

			if ((window.user.rights.recruit || window.user.rights.promote || window.user.rights.banish) && members[id].grade < window.member.grade && window.member.grade >= 4)
			{
				
				doc.id("members-editor-id").value = id;
				
				doc.id("members-editor-username").value = members[id].username;
				
				if (window.member.grade < security)
				{
					doc.id("members-editor-username").setAttribute("disabled","true");
				}
				
				for (let i in Clan.grade.m)
				{
					if (i < window.member.grade)
					{
						if (i > 0 || window.user.rights.banish)
						{
							doc.id("members-editor-grade").innerHTML += `<option ${i == members[id].grade ? "selected" : ""} value="${i}">${Clan.grade.m[i]}</option>`;
						}
					}
				}
				
				doc.id("members-editor-genre").innerHTML = `<option ${members[id].genre ? "": "selected"} value="0">M</option><option ${members[id].genre ? "selected" : ""} value="1">F</option>`;
				
				if (window.member.grade < security)
				{
					doc.id("members-editor-genre").setAttribute("disabled","true");
				}
				
				doc.id("members-editor-email").value = members[id].email;
				
				if (window.member.grade < security)
				{
					doc.id("members-editor-email").setAttribute("disabled","true");
				}

				doc.id("members-editor-rights-banish").checked = user.rights.banish;
				doc.id("members-editor-rights-news").checked = user.rights.news;
				doc.id("members-editor-rights-promote").checked = user.rights.promote;
				doc.id("members-editor-rights-recruit").checked = user.rights.recruit;

				if (!window.user.rights.banish)
				{
					doc.id("members-editor-rights-banish").setAttribute("disabled","true");
				}

				if (!window.user.rights.news)
				{
					doc.id("members-editor-rights-news").setAttribute("disabled","true");
				}

				if (!window.user.rights.promote)
				{
					doc.id("members-editor-rights-promote").setAttribute("disabled","true");
				}

				if (!window.user.rights.recruit)
				{
					doc.id("members-editor-rights-recruit").setAttribute("disabled","true");
				}

				doc.id("members").style.display = "none";
				doc.id("members-editor").style.display = "block";
			}
		});
	});
};