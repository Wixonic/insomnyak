const init = () =>
{
	Clan.members()
	.then((members) =>
	{
		doc.id("membersLength").innerHTML = members.length;
		
		if (members.length > 0)
		{
			doc.id("members").innerHTML = "";
			
			for (let i in members)
			{
				if (i !== "length")
				{
					const member = members[i];
					const grade = member.genre ? Clan.grade.f[member.grade] : Clan.grade.m[member.grade];
					doc.id("members").innerHTML += `<a href="details/?u=${i}" class="member" grade="${member.grade}"><div class="username">${member.username || "Anonyme"}</div><div class="grade">${grade || Clan.grade.m[1]}</div></a>`;
				}
			}
		} else {
			doc.id("members").innerHTML = `<b>An error occured</b><br />We can't find members`;
		}
	}).catch((e) => {
		doc.id("members").innerHTML = `<b>An error occured</b><br />${e}`;
	});
};