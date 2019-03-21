var tabInformation = ["Nutri Score","Nova","Nitrites","Huile de palme"];
/*--------------------------------------------------------------
----------------------------------------------------------------

			 __          __        _             
			 \ \        / /       | |            
			  \ \  /\  / /__  _ __| | _____ _ __ 
			   \ \/  \/ / _ \| '__| |/ / _ \ '__|
				\  /\  / (_) | |  |   <  __/ |   
				 \/  \/ \___/|_|  |_|\_\___|_|   
												  
----------------------------------------------------------------
--------------------------------------------------------------*/
function worker_function() {

url = "https://fr.openfoodfacts.org/api/v0/produit/"
requestFields = "?fields=nova_groups,nutrition_grades,additives_prev_original_tags,states_tags,ingredients_from_palm_oil_n,categories_tags,labels_tags"
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

self.onmessage = function(e) {
    switch(e.data.name) {
      case "barCode": 
          var barCode= JSON.parse(e.data.data);
			console.log("Liste reçue et décodée");
		console.log(barCode);
          break;
      default:
        console.error("Unknown message:", e.data.name);
    }
  

var result=new Array();
 
 
 
for (var i=0 ; i<barCode.length ; i++){
			result[i] = findArticle(barCode[i]);
}

var string = JSON.stringify(result);
postMessage({name:"result", data:string});

}}

/*--------------------------------------------------------------
----------------------------------------------------------------
  _    _ _______ _____ _      _____ _______ _____ ______  _____ 
 | |  | |__   __|_   _| |    |_   _|__   __|_   _|  ____|/ ____|
 | |  | |  | |    | | | |      | |    | |    | | | |__  | (___  
 | |  | |  | |    | | | |      | |    | |    | | |  __|  \___ \ 
 | |__| |  | |   _| |_| |____ _| |_   | |   _| |_| |____ ____) |
  \____/   |_|  |_____|______|_____|  |_|  |_____|______|_____/ 
                                                                
                                                                
----------------------------------------------------------------
--------------------------------------------------------------*/


function createDiv(typeDiv, classDiv, textContent)
{
	var div = document.createElement(typeDiv);
	div.setAttribute("class", classDiv);
	div.textContent=textContent;
	return div;
}

function insertIn(nodeParent, nodeToInsert)
{
	nodeParent.insertBefore(nodeToInsert, null);
}

function insertInHtml(parent, dataTab, iteratorTab,singleArticle)
{
	var li=createDiv("li","product-badge");
	insertIn(parent, li);
	if (singleArticle)
		var img=createDiv("img","cssProduct");
	else
		var img=createDiv("img","cssProducts");
	img.src = chrome.extension.getURL('images/'+dataTab[iteratorTab]+'.png');
	var span=createDiv("span","product-badge-title",tabInformation[iteratorTab]);
	insertIn(li,img);
	insertIn(li,span);
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


function createImgDiv(newNode , result)
{
/*
Create tag img for the differents pictures
*/

var newContent = document.createElement('img');

//Set attributes
newContent.src = chrome.extension.getURL('images/'+result+'.png');
newContent.style="height: 2.5rem !important;margin : 0 0.4rem !important;";

return newNode.appendChild(newContent);  
}

/*--------------------------------------------------------------
----------------------------------------------------------------
   _____          _____  _____  ______ ______ ____  _    _ _____  
  / ____|   /\   |  __ \|  __ \|  ____|  ____/ __ \| |  | |  __ \ 
 | |       /  \  | |__) | |__) | |__  | |__ | |  | | |  | | |__) |
 | |      / /\ \ |  _  /|  _  /|  __| |  __|| |  | | |  | |  _  / 
 | |____ / ____ \| | \ \| | \ \| |____| |   | |__| | |__| | | \ \ 
  \_____/_/    \_\_|  \_\_|  \_\______|_|    \____/ \____/|_|  \_\
                                                                  
----------------------------------------------------------------
--------------------------------------------------------------*/


function treatmentCarrefourProducts()
{
	/*
		Treatement for brand Carrefour
	*/
	
	
		// Get the list of div of articles
		var parent = document.getElementsByClassName("product-card__badges");
		var firstClass;
		
		
		var iList = new Array();
		var barCode= new Array();
		
		//For each article do...
		for (var i = 0; i<parent.length ; i++) {
			
			
			
			//If the value aren't modify do the treatement
			if (parent[i].className!="product-card__badges readed" ){ //&& articles[i].className"product-card product-card--horizontal") { 
			
			parent[i].setAttribute("class","product-card__badges readed");
			
			iList.push(i);

			
			var article;
			article=parent[i];
			
			//Find the tag name of the parent div
			var l=0;
			while (article.tagName!="ARTICLE") {
				l=l+1;
				article=article.parentNode;
			}
			
			//Get the ID of the product
			barCode.push(article.id);
			if (barCode.length==1){
				firstClass=article.className;
			}
			
			}
		}
		
		if (barCode.length==0){
			return;
		}
		
		var treatmentOffWorker  = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
		
		console.log("Liste avant envoi");
		console.log(barCode);
		var string = JSON.stringify(barCode);
		treatmentOffWorker.postMessage({name:"barCode", data:string});
		
		

		treatmentOffWorker.onmessage = function(e) {
			switch(e.data.name) {
			  case "result": 
			  console.log("Liste resultat");
		console.log(result);
		console.log("listI");
		console.log(iList);
				  var result= JSON.parse(e.data.data);
				  
				  break;
			  default:
				console.error("Unknown message:", e.data.name);
				
			}

		
		
		
		//For each article to treat do...
		var parent = document.getElementsByClassName("product-card__badges");
		var startWrite=0;
		
		while (true){
			var article=parent[startWrite+iList[0]];
			while (article.tagName!="ARTICLE") {
				article=article.parentNode;
			}
			if ((article.id!=barCode[0]) || (firstClass!=article.className)){
				//if (startWrite==0){
					//setTimeout(function(){call(main.js);},1);
				//}
				startWrite++;
			}
			else {
				break;
			}
		}
		

		
		
		for (var j=0; j<result.length; j++) {
			
			
			//Next iteration if product not found
			if (result[j]===null){
				continue;
			}

	//Tag where pictures will be insert
	ulParent=createDiv("ul","product-badges-list tabNutriNova");

			ulParent=parent[iList[j]+startWrite].insertBefore(ulParent, null);
	for (var i=0; i<result[j].length;i++)
	{
		if ((i==2 || i==3) && result[j][i]!=null)
		{
			insertInHtml(ulParent,result[j],i);
		}
		else if ((i!=2 && i!=3))
		{
			insertInHtml(ulParent,result[j],i);
		}
	}

		
			parent[j+startWrite].setAttribute("barCode_debug",barCode[j]);
				
			
		}
		}	

}





function treatmentCarrefourProduct()
{
var idProduct = document.getElementsByClassName("webcollage")[0].getAttribute("data-ean");
var barCode= new Array();
barCode.push(idProduct);

var treatmentOffWorker  = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
		var string = JSON.stringify(barCode);
		treatmentOffWorker.postMessage({name:"barCode", data:string});
treatmentOffWorker.onmessage = function(e) {
			switch(e.data.name) {
			  case "result": 
				  var resultTab= JSON.parse(e.data.data);
				  
				  break;
			  default:
				console.error("Unknown message:", e.data.name);
				
			}

//If the product is found
if (resultTab[0]!==null){
	var result=resultTab[0];

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
}

/*--------------------------------------------------------------
----------------------------------------------------------------
			  __  __          _____ _   _ 
			 |  \/  |   /\   |_   _| \ | |
			 | \  / |  /  \    | | |  \| |
			 | |\/| | / /\ \   | | | . ` |
			 | |  | |/ ____ \ _| |_| |\  |
			 |_|  |_/_/    \_\_____|_| \_|
										  
										  
----------------------------------------------------------------
--------------------------------------------------------------*/


function main(){
	debugger;
	var url=document.URL;
	if(url.includes("https://www.carrefour.fr/p/"))
	{
		treatmentCarrefourProduct();
	}
	else if (url.includes("https://www.carrefour.fr/"))
	{
		treatmentCarrefourProducts();
	}

}


main();

