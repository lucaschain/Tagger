Tagger
======

Implementação:
==============


Crie o objeto javascript:
<pre>
<code>
var names = {
  HOME			: 
  { 
    omniture: "s:comemorativos:receitas:home", //Page Name Omniture
    ga : {
      action :     'clique',   //Acão GA
      marker :  'load:home', //Marcador GA
      category: 'loads' //Categoria GA
    }
  },
  LINK_CADASTRO			: 
  { 
    omniture: "s:comemorativos:receitas:linkcadastro", //Page Name Omniture
    ga : {
      action :     'clique',   //Acão GA
      marker :  'cadastro:acs', //Marcador GA
      category: 'cadastro' //Categoria GA
    }
  }
};
</code>
</pre>

## Track via JS
````
var options = {
	ga: true,
	omniture: true
};

Tagger.Track('LINK_CADASTRO', options);
````


## Track link/page load via html:
Page load:
````
<body data-tag="load" data-omniture="true" data-ga="true" data-gapageview="true" data-name="HOME">

<a data-tag="link" data-omniture="true" data-ga="true" data-name="LINK_CADASTRO">
````


## Options
- ga - Boolean (false) : especifica se vai taguear via GA
- omniture - Boolean (false) : especifica se vai taguear via Omniture
- gaPageView - Boolean (false) : especifica se a tag de GA é page_view
- events - String : Quais eventos (separado por vírgula) o track vai disparar
- vars - AssociativeArray : Variáveis e valores que o track vai disparar, <br />ex:  { evar74 : 'lalala', evar50 : 123 }
- params - Array : Parâmetros para substituir o pagename, ex: <br /> para 'sadia:compartilhe:@1:@2' use ['valor_parametro1', 'valor_parametro2']
