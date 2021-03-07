const HOST = "https://wixonic.github.io/insomnyak";

const doc = {
	head: document.head,
	body: document.body,
	
	id: (i) => document.getElementById(i),
	class: (c) => document.getElementsByClassName(c),
	tag: (t) => document.getElementsByTagName(t)
};

const GET = (url) =>
{
	return new Promise((resolve) =>
	{
		const xhr = new XMLHttpRequest();
		
		xhr.open("GET",HOST + url,false);
		xhr.send();
		
		resolve(xhr.responseText);
	});
};

window.addEventListener("DOMContentLoaded",() => {
	try
	{
		doc.tag("header")[0].innerHTML = `<a href="${HOST}/index.html" class="fas fa-home"></a><b>INSOMNYAЖ</b><empty></empty>`;
	} catch {}
});
