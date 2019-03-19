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

function findArticle(codeBarre){
	if (codeBarre==null){
		return null,null;
	}
	jsonUrl = url+codeBarre+".json";

	obj = JSON.parse(requeteHTTP(jsonUrl));
	nova=obj.product.nova_groups;
	nutriscore=obj.product.nutrition_grades;
	return [nutriscore, nova];

}

function main(tabId, changeInfo, tab){
	var parent = document.getElementsByClassName("product-card__badges");

	

	
		for (var i = 0; i<parent.length ; i++) {
			if (parent[i].attributes[0].value!="product-card__badges conteneurTabNutriNova") { 
			var article;
			article=parent[i]
			while (article.tagName!="ARTICLE") {
				article=article.parentNode;

			}
			codeBarre=article.attributes[0].value;

			var resultat = findArticle(codeBarre);
			var newNode=document.createElement("ul");
			newNode.setAttribute("class", "product-badges-list tabNutriNova" );
			var newContent = document.createTextNode(resultat[0] + " "+ resultat[1]); 
			newNode.appendChild(newContent);  

			parent[i].insertBefore(newNode, parent.lastChild);
			parent[i].setAttribute("class","product-card__badges conteneurTabNutriNova")
		}
	}

}


main();

