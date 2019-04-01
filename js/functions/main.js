function main()
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
			singleProductCarrefour();
		}
		else
		{
			firstPageTreatmentCarrefour();
			observerCarrefour();
		}
	}

}

$(window).bind("load", function (){
main();
}
);