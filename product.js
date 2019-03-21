//alert(document.URL);
url = "https://fr.openfoodfacts.org/api/v0/produit/";
requestFields = "?fields=nova_groups,nutrition_grades,additives_prev_original_tags,states_tags,ingredients_from_palm_oil_n,categories_tags,labels_tags";
var regexCharcuterie = new RegExp(".*charcuteries.*");





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
	return null;
}

jsonUrl = url+barCode+".json"+requestFields;


//Split the attribute of the JSON
obj = JSON.parse(requeteHTTP(jsonUrl));

//return null if product not found
if (obj.status == 0)
	return null;

//Get the attribute nova
if('nova_groups' in obj.product)
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

//Get the attribute nitrites
var nitrites = null;
//If the product contains a label "without nitrits" 
if (('labels_tags' in obj.product) && (obj.product.labels_tags.includes("fr:sans-nitrite"))){
	nitrites="withoutNitrites";
}
//Else verify if categories and ingredients of the product are completed
else if (obj.product.states_tags.includes('en:categories-completed') && obj.product.states_tags.includes('en:ingredients-completed')){
//Verify if additives are compled and if contains e250
if  (('additives_prev_original_tags' in obj.product) && (obj.product.additives_prev_original_tags.includes('en:e250'))) {
	nitrites="withNitrites";
}
//Verify if product is charcuterie and if additives are completed
else if ((regexCharcuterie.test(obj.product.categories_tags)) && ('additives_prev_original_tags' in obj.product)){
	nitrites="withoutNitrites";
}
}


//Get the attribute palm
var palm = null;
//If the product contains a label "palm-oil-free" 
if (('labels_tags' in obj.product) && (obj.product.labels_tags.includes("en:palm-oil-free"))){
	palm= "withoutPalm";
}
//Else check the number of ingredients_from_palm_oil
else if ("ingredients_from_palm_oil_n" in obj.product){
	if (obj.product.ingredients_from_palm_oil_n>0){
		palm= "withPalm";
	}
}

return [nutriscore, nova, nitrites, palm];

}

function main()
{
var idProduct = document.getElementsByClassName("webcollage")[0].getAttribute("data-ean");
var result = findArticle(idProduct);

//If the product is found
if (result!==null){


	//Get the ul parent div
	var ulParent = document.getElementsByClassName("product-badges-list");

	for (var i=0; i<result.length;i++)
	{
		if ((i==2 || i==3) && result[i]!=null)
		{
			insertInHtml(ulParent[0],result,i);
		}
		else if ((i!=2 && i!=3))
		{
			insertInHtml(ulParent[0],result,i);
		}
	}
}
}

main();