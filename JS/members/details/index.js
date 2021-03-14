const init = () =>
{
	Clan.members()
	.then((members) =>
	{
		Clan.members(true)
		.then((membersNotSorted) =>
		{
			const uID = window.location.search.split("&")[0].split("u=")[1];
			
			try
			{
				const member = members[Number(uID)];
				
				doc.head.innerHTML = doc.head.innerHTML.replaceAll("{name}",member.username);
				
				doc.id("name").innerHTML = member.username;
				doc.id("grade").setAttribute("grade",member.grade);
				doc.id("grade").innerHTML = member.genre ? Clan.grade.f[member.grade] : Clan.grade.m[member.grade];
				
				if (member.email)
				{
					doc.id("container").innerHTML = member.email ? "<a href=\"mailto:" + member.email + "\" class=\"fas fa-envelope\"></a>" : "";
				}
				
				doc.id("datas").innerHTML = `<tr><td>Nom :</td><td>${member.username}</td></tr><tr><td>Genre :</td><td>${member.genre ? "F" : "M"}</td></tr><tr><td>Grade :</td><td>${member.grade}</td></tr><tr><td>Email :</td><td>${member.email ? "<a class=\"link\" href=\"mailto:" + member.email + "\">Oui</a>" : "Aucun"}</td></tr><tr><td>Recruté </td><td>${member.recruited == -1 ? "avant la mise à jour du site" : "par " + membersNotSorted[member.recruited].username}.</td></tr>`;
			} catch(e) {
				document.head.innerHTML = document.head.innerHTML.replaceAll("{name}","Oops");
				document.body.innerHTML = "Oops ! An error occured !<br />" + e;
			}
		}).catch(e => {
			document.head.innerHTML = document.head.innerHTML.replaceAll("{name}","Oops");
			document.body.innerHTML = "Oops ! An error occured !<br />" + e;
		});
	});
};