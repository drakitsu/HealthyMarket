function worker_function()
{
	self.onmessage = function (e)
	{
		var idProductList = JSON.parse(e.data.idProductList);
		console.log("Liste de produit reçue par le worker: " + idProductList);
		console.log("Url du fichier functional.js : " + e.data.path);
		importScripts(e.data.path);
		
		var result = new Array();

		for (var i = 0; i < idProductList.length; i++)
		{
			result[i] = findArticleById(idProductList[i]);
		}

		var string = JSON.stringify(result);
		postMessage(
		{
			name: "result",
			data: string
		}
		);

	}
}
