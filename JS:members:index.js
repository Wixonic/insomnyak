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
				
				for (let i in members)
				{
					const member = members[i];
					const grade = member.genre ? gradef[member.grade] : gradem[member.grade];
					
					doc.id("members").innerHTML += `<div class="member" grade="${member.grade}"><div class="username">${member.username || "Anonyme"}</div><div class="grade">${grade || gradem[0]}</div><div class="container">${member.badge ? '<div class="badge">' + member.badge + '</div>' : ""}${member.email ? '<a href="mailto:' + member.email + '" title="' + member.email + '" class="email fas fa-envelope"></a>' : ""}</div></div>`;
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