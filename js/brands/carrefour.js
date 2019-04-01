function firstPageTreatmentCarrefour(){
	articles=$( ".product-grid" ).find("li.product-grid-item");
	//Supprime le dernier article
	articles.splice(-1,1)
	console.log(articles);
	multipleProductsCarrefour(articles);
}

function observerCarrefour(){

	// The node to be monitored
	var target = $(".product-grid")[0];
	articles=[];
	// Create an observer instance
	var observer = new MutationObserver(function (mutations)
		{
			mutations.forEach( function( mutation ) {
			articles.push(mutation.addedNodes[0]);
				
			});
			console.log(articles);
			multipleProductsCarrefour(articles);
		}
		);

	// Configuration of the observer:
	var config =
	{
		attributes: true,
		childList: true,
		characterData: true
	};

	// Pass in the target node, as well as the observer options
	observer.observe(target, config);
}

function createDivPictureCarrefour(tabNutriNova,result,tabInformation, singleProduct){
	liImg=$(tabNutriNova).append('<li class="product-badge"></li>')[0].lastChild;
	if (singleProduct==true)
		img=$(liImg).append('<img class="carrefourPicturesProduct">')[0].lastChild;
	else
		img=$(liImg).append('<img class="carrefourPicturesProducts">')[0].lastChild;
	$(img).attr("src",chrome.extension.getURL('images/'+result)+'.png');
	$(liImg).append('<span class="product-badge-title">'+tabInformation+'</span>');
}

function multipleProductsCarrefour(items)
{
	/*
	Treatement for Carrefour - Mutliple products
	 */

	// Get the list of div of articles
	//var parent = document.getElementsByClassName("product-card__badges");
	var idProductList = new Array();
	
	/* var flag=0;
	var fisrtElementPlace=0; */
	//For each article do...
	for (var i = 0; i < items.length; i++)
	{
		article=items[i].childNodes[0];
		
		if (article.className != "product-card carrefourReaded")
		{
			/* if(flag==0)
			{
				fisrtElementPlace=i;
				flag=1;
			} */
			$(article).addClass("carrefourReaded");
			/* var article = parent[i];
			//Find the tag name of the parent div
			while (article.tagName != "ARTICLE")
			{
				article = article.parentNode;
			}
 */
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

			article=items.find("article#"+idProductList[j])[0];
			badge=$(article).find("div.product-card__badges")[0];
			
			
			$(badge).append( '<ul class="product-badges-list tabNutriNova"></ul>' );
	
			//Next iteration if product not found
			if (result[j] === null)
			{
				continue;
			}

			//Tag where pictures will be insert
			
			
			tabNutriNova=badge.childNodes[badge.childNodes.length-1];
			
			//ulParent = createDiv("ul", "product-badges-list tabNutriNova");

			//ulParent = parent[j+fisrtElementPlace].insertBefore(ulParent, null);
			for (var i = 0; i < result[j].length; i++)
			{
				if ((i == 2 || i == 3) && result[j][i] != null)
				{
					createDivPictureCarrefour(tabNutriNova, result[j][i], tabInformation[i]);
				}
				else if ((i != 2 && i != 3))
				{
					createDivPictureCarrefour(tabNutriNova, result[j][i], tabInformation[i]);
				}
			}

			$(badge).attr("idProductList_debug", idProductList[j]);

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

			//Get the ul parent divvar ulParent = document.getElementsByClassName("product-badges-list");
			tabNutriNova=$(document).find("ul.product-badges-list")[0]
			
			for (var i = 0; i < result.length; i++)
			{
				if ((i == 2 || i == 3) && result[i] != null)
				{
					createDivPictureCarrefour(tabNutriNova, result[i],tabInformation[i],true);
				}
				else if ((i != 2 && i != 3))
				{
					createDivPictureCarrefour(tabNutriNova,result[i],tabInformation[i],true);
				}
			}
		}

	}
}
