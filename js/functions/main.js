function main(articles)
{
	//Domaine
	domain = window.location.origin;
	//Chemin web
	path = window.location.pathname;

	//If .serch==-1 => FALSE
	if (domain.search("carrefour.fr") != -1)
	{
		if (path.search("/p/") != -1)
		{
			//alert("ok simple");
			singleProductCarrefour();
		}
		else
		{
			//alert("ok multiple");
			multipleProductsCarrefour(articles);
		}
	}

}

//$(window).bind("load", function ()
//{
	articles=$( ".product-grid" ).find("li.product-grid-item");
	//Supprime le dernier article
	articles.splice(-1,1)
	console.log(articles);
	main(articles);





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
			main(articles);
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

	// Later, you can stop observing
	//observer.disconnect();


	/*
	$("body").on('DOMSubtreeModified', ".product-card__title", function (e)
{
	//main();
	console.log("Nouveau: "+e.target);
	}
	);*/

//}
//);
