window.addEventListener("DOMContentLoaded",() => {
	GET("/Datas/grades-f.json")
	.then((gradef) =>
	{
		gradef = JSON.parse(gradef);
		
		GET("/Datas/grades-m.json")
		.then((gradem) =>
		{
			gradem = JSON.parse(gradem);
			
			GET("/Datas/members.json")
			.then((members) =>
			{
				members = JSON.parse(members);
				
				const length = doc.class("membersLength");
				
				for (let i = 0; i < length.length; ++i)
				{
					length[i].innerHTML = members.length;
				}
				
				doc.id("members").innerHTML = "";

				for (let i in members)
				{
					const member = members[i];
					const grade = member.genre ? gradef[member.grade] : gradem[member.grade];
					
					doc.id("members").innerHTML += `<a href="../members/details/?u=${i}" class="member" grade="${member.grade}"><div class="username">${member.username || "Anonyme"}</div><div class="grade">${grade || gradem[0]}</div></a>`;
				}
			}).catch((e) => {
				doc.id("members").innerHTML = `<b>An error occured</b><br />${e}`;
			});
		}).catch((e) => {
			doc.id("members").innerHTML = `<b>An error occured</b><br />${e}`;
		});
	}).catch((e) => {
		doc.id("members").innerHTML = `<b>An error occured</b><br />${e}`;
	});
});
