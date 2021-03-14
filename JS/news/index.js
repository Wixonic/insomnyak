const init = () =>
{
	Clan.news()
	.then((news) =>
	{
		if (news.length > 0)
		{
			doc.id("news").innerHTML = "";
		}
		
		for (let i in news)
		{
			doc.id("news").innerHTML += `<div class="new"><div class="title">${news[i].title}</div><div class="description">${news[i].description}</div></div>`;
		}
	}).catch((e) => {
		doc.id("news").innerHTML = `<b>An error occured</b><br />${e}`;
	});
};