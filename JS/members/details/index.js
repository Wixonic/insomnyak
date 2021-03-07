window.addEventListener("DOMContentLoaded",() =>
{
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
				
				const uID = window.location.search.split("&")[0].split("u=")[1];
				if (!isNaN(uID) && uID < members.length)
				{
					const member = members[Number(uID)];
					
					doc.head.innerHTML = doc.head.innerHTML.replaceAll("{name}",member.username);
					
					
					doc.id("name").innerHTML = member.username;
					doc.id("grade").setAttribute("grade",member.grade);
					doc.id("grade").innerHTML = member.genre ? gradef[member.grade] : gradem[member.grade];
					
					if (member.email || member.badge)
					{
						doc.id("container").innerHTML = `${member.email ? "<a href=\"mailto:" + member.email + "\" class=\"fas fa-envelope\"></a>" : ""}${member.email && member.badge ? "<br />" : ""}${member.badge ? "<span class=\"badge\">" + member.badge + "</span>" : ""}`;
					}

					doc.id("datas").innerHTML = `<tr><td>Nom :</td><td>${member.username}</td></tr><tr><td>Genre :</td><td>${member.genre ? "F" : "M"}</td></tr><tr><td>Grade :</td><td>${member.grade}</td></tr><tr><td>Email :</td><td>${member.email ? "<a class=\"link\" href=\"mailto:" + member.email + "\">Oui</a>" : "Aucun"}</td></tr><tr><td>Badge(s) :</td><td>${member.badge ? member.badge : "Aucun"}</td></tr>`;
				} else {
					document.head.innerHTML = document.head.innerHTML.replaceAll("{name}","Oops");
					document.body.innerHTML = "Oops ! An error occured !";
				}
			});
		});
	});
});