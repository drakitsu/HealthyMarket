url = "https://fr.openfoodfacts.org/api/v0/produit/"

function makeHttpObject() {
	try {return new XMLHttpRequest();}
	catch (erreur) {}
	try {return new ActiveXObject("Msxml2.XMLHTTP");}
	catch (erreur) {}
	try {return new ActiveXObject("Microsoft.XMLHTTP");}
	catch (erreur) {}

	throw new Error("La création de l’objet pour les requêtes HTTP n’a pas pu avoir lieu.");
}


function requeteHTTP(URL){
	var requete = makeHttpObject();
	requete.open("GET", URL , false);
	requete.send(null);
	return requete.responseText;
}

function findArticle(barCode){
	/*
		Do a search on OpenFoodFacts to get the attribute of the product
	*/
	
	//Error management
	if (barCode==null){
		return null,null;
	}
	
	jsonUrl = url+barCode+".json";
	
	
	//Split the attribute of the JSON
	obj = JSON.parse(requeteHTTP(jsonUrl));
	
	//return null if product not found
	if (obj.status_verbose == "product not found")
		return null,null;
	
	//Get the attribute nova
	if('nova_groups' in obj.product)// || obj.product.nova_groups=="undefined")
	{
		nova=obj.product.nova_groups;	
	}
	else
	{
		
			nova="nullNova";
	}
	
	//Get the attribute nutriscore
	if ('nutrition_grades' in obj.product)
		nutriscore=obj.product.nutrition_grades;
	else
		nutriscore="nullNutriscore";
	

	return [nutriscore, nova];

}

function treatmentCarrefour()
{
	/*
		Treatement for brand Carrefour
	*/
	
	
		// Get the list of div of articles
		var parent = document.getElementsByClassName("product-card__badges");
		
		//For each article do...
		for (var i = 0; i<parent.length ; i++) {
			
			//If the value aren't modify do the treatement
			if (parent[i].className!="product-card__badges modify") { 
			
			var article;
			article=parent[i];
			
			//Find the tag name of the parent div
			var l=0;
			while (article.tagName!="ARTICLE") {
				l=l+1;
				article=article.parentNode;
			}
			
			//Get the ID of the product
			barCode=article.id;
	
			
			//Find the product on OpenFoodFacts
			var resultat = findArticle(barCode);
			
			//Next iteration if product not found
			if (resultat===null){
				continue;
			}
			
			//Tag where nova and nutriscore will be insert
			var newNode=document.createElement("ul");
			newNode.setAttribute("class", "product-badges-list tabNutriNova" );
			
			//Create the 2 pictures in HTML tag
			var nova=putPicture(newNode,resultat[0]);
			var nutriscore =putPicture(newNode,resultat[1]);  
			
			newNode=parent[i].insertBefore(newNode, parent.lastChild);
			newNode.insertBefore(nutriscore, newNode.lastChild);
			newNode.insertBefore(nova, newNode.lastChild);
			parent[i].setAttribute("class","product-card__badges modify")
		}
	}

}

function createUl()
{
		var newContent = document.createElement('ul');
		newContent.setAttribute("class", "product-badges-list");
		return newContent;
}

function putPicture(newNode , resultat)
{
	/*
		Create tag img for the differents pictures
	*/
	
	var newContent = document.createElement('img');
	
	//Set attributes
	newContent.src = chrome.extension.getURL('images/'+resultat+'.png');
	newContent.style="height: 2rem !important;margin : 0 0.4rem !important;";
	
	return newNode.appendChild(newContent);  
}

function main(){
	treatmentCarrefour();

}


main();

