function multipleProductsCarrefour()
{
	/*
	Treatement for Carrefour - Mutliple products
	 */

	// Get the list of div of articles
	var parent = document.getElementsByClassName("product-card__badges");
	var idProductList = new Array();
	
	var flag=0;
	var fisrtElementPlace=0;
	//For each article do...
	for (var i = 0; i < parent.length; i++)
	{
		//If the value aren't modify do the treatement
		if (parent[i].className != "product-card__badges carrefourReaded")
		{
			if(flag==0)
			{
				fisrtElementPlace=i;
				flag=1;
			}
			parent[i].setAttribute("class", "product-card__badges carrefourReaded");
			var article = parent[i];
			//Find the tag name of the parent div
			while (article.tagName != "ARTICLE")
			{
				article = article.parentNode;
			}

			//Get the ID of the product
			idProductList.push(article.id);

		}
	}

	if (idProductList.length == 0)
	{
		return;
	}

	workerThread = createWorker(idProductList);
	workerThread.onmessage = function (e)
	{
		switch (e.data.name)
		{
		case "result":
			console.log("Liste resultat");
			console.log(result);
			var result = JSON.parse(e.data.data);

			break;
		default:
			console.error("Unknown message:", e.data.name);

		}

		for (var j = 0; j < result.length; j++)
		{

			//Next iteration if product not found
			if (result[j] === null)
			{
				continue;
			}

			//Tag where pictures will be insert
			ulParent = createDiv("ul", "product-badges-list tabNutriNova");

			ulParent = parent[j+fisrtElementPlace].insertBefore(ulParent, null);
			for (var i = 0; i < result[j].length; i++)
			{
				if ((i == 2 || i == 3) && result[j][i] != null)
				{
					insertInHtml(ulParent, result[j], i);
				}
				else if ((i != 2 && i != 3))
				{
					insertInHtml(ulParent, result[j], i);
				}
			}

			parent[j+fisrtElementPlace].setAttribute("idProductList_debug", idProductList[j]);

		}
	}

}

function singleProductCarrefour()
{
	var idProduct = document.getElementsByClassName("webcollage")[0].getAttribute("data-ean");
	var idProductList = new Array();
	idProductList.push(idProduct);

	workerThread = createWorker(idProductList);
	workerThread.onmessage = function (e)
	{
		switch (e.data.name)
		{
		case "result":
			var resultTab = JSON.parse(e.data.data);

			break;
		default:
			console.error("Unknown message:", e.data.name);

		}

		//If the product is found
		if (resultTab[0] !== null)
		{
			var result = resultTab[0];

			//Get the ul parent div
			var ulParent = document.getElementsByClassName("product-badges-list");

			for (var i = 0; i < result.length; i++)
			{
				if ((i == 2 || i == 3) && result[i] != null)
				{
					insertInHtml(ulParent[0], result, i, true);
				}
				else if ((i != 2 && i != 3))
				{
					insertInHtml(ulParent[0], result, i, true);
				}
			}
		}

	}
}
