var Tagger = {
	pageName : '',
	names : {},
	videos: [],
	storage : {},
	gaq : false,
	s : false,
	parsed: false,
	
	/**
	* Starta o tagger
	*
	* @method init
	* @param {String} channel | Channel da página
	* @param {Array} names | Array com nomes das page names
	*/
	init: function(persistentInfo, names, videos){
		if (typeof s !== "undefined"){
			s.channel = persistentInfo.channel;			
		}

		if (typeof _gaq !== "undefined"){
			_gaq.category = persistentInfo.category;
		}
		if (!!videos){
			this.videos = videos;
		}
		this.names = names;

		if ( !this.parsed )
			this.parseDomData();
	},
	
	/**
	* Trackeia via omniture e ga
	*
	* @method Track
	* @public
	* @param {String} name | Pagename do track
	* @param {object} option | Objeto de opções (como parametro de tracks, etc)
	*/
	track : function(name, options){
		console.log("The method 'track' is deprecated, use 'Track' instead");
		this.Track(name, options);
	},
  
  trackOmniture: function(name, options){
		var pageName = '';
		var pageAction = '';
		var pageCategory = '';
		var replacedPageName = '';
    this.clearEventsAndVars();
    if (!!options.vars){
      $.each(options.vars,function(index, value){
        s[index] = value;
      });
    }
    if (!!options.events){
      s.events = options.events;
    }
    if (!!this.names[name])
      pageName = this.names[name].omniture;		
    else
      pageName = name;

    if (!!options.params)
      replacedPageName = this.replaceParams(pageName, options.params);
    else 
      replacedPageName = pageName;
    
    if (!options.customLink){
      s.pageName = replacedPageName;	
      s.t();
    }else{
      s.tl(this, 'o', replacedPageName);
    }
  },
  trackMelt: function(name, options){
    //TODO Implement Melt tracker  
  },
  trackGa: function(name, options){
		var pageName = '';
		var pageAction = '';
		var pageCategory = '';
		var replacedPageName = '';
    if (!!options.pageView){

      if (!!this.names[name])
        pageName = this.names[name].ga;		
      else
        pageName = name;
      if (!!options.params)
        replacedPageName = this.replaceParams(pageName, options.params);
      else
        replacedPageName = pageName;

      _gaq.push(['second._trackPageview', replacedPageName]);
    }
    else{
      if (!!this.names[name]){
        pageName = this.names[name].ga.marker;
        pageAction = this.names[name].ga.action;

        pageCategory = this.names[name].ga.category || _gaq.category;
      }
      else{
        pageMarker = name;
        pageAction = name;
        pageCategory = _gaq.category;
      }
      
      
      if (!!options.params)
        replacedPageName = this.replaceParams(pageName, options.params);
      else 
        replacedPageName = pageName;
      
      _gaq.push(['second._trackEvent', pageCategory, pageAction, replacedPageName]);
    }	
  },

	Track : function(name, options){
		options = options || {};
		if (options.omniture)
      this.trackOmniture(name, options);
		if (options.ga && !!_gaq)
      this.trackGa(name, options);
    if (options.melt)
      this.trackMelt(name, options);
	},
	
	/**
	* Substitui os parâmetros do name pelos parametros informados 
	* @method replaceParams
	* @private
	* @param {String} name | Pagename que será substituido
	* @param {params} array | Array com os parâmetros
	*/
	replaceParams : function(name, params){
		for (var i = 0; i < params.length; i++)
		{
			name = name.replace("@"+(i+1), params[i]);
		}
		return name;
	},
	
	
	/**
	* Limpa o conteudo das eVars e events 
	* Adicione aqui todas as eVars utilizadas para que sejam limpadas
	* @method clearEventsAndVars
	* @private
	*/
	clearEventsAndVars : function(){
		s.events = "";
		s.prop65 = "";
		s.prop66 = "";
		s.prop67 = "";
		s.evar66 = "";
		s.evar67 = "";
	},
	
	
	/**
	* Lê as tags do dom com data-* para bindar e disparar eventos 
	* Para criar um bind, adicione no link a data-tag = 'link' | 'load', juntamente com data-name e data-[tecnologia] (omniture ou ga) 
	* @method parseDomData
	* @private
	*/
	parseDomData : function(){
		var _that = this;
		//Binda os clicks
		$("body").on("click","*[data-tag='link']",function(){
			var name = $(this).data('name');
			var params = new Array();
			if ($(this).data('param'))
				params.push($(this).data('param'));
			var options = {
				params : params
			};
			if ($(this).data('custom')){
				options.customLink = true;
			}
			if ($(this).data('omniture')){
				options.omniture = true;
			}
			if ($(this).data('ga')){
				options.ga = true;
			}
			if ($(this).data('melt')){
				options.melt = true;
			}
			if ($(this).data('pageview')){
				options.pageView = true;
			}

			_that.Track(name, options);
		});
    

    //Tagueia scroll
    var sections = $("*[data-tag='scroll'");
		$(window).scroll(function(){
      var scroll = $(window).scrollTop();
      
      sections.each(function(){
        var offsetTop = $(this).position().top + 80;
        var offsetBot = $(this).position().top + $(this).height();
        if (!$(this).data('tagged') && scroll > offsetTop && scroll < offsetBot){
          var name = $(this).data('name');
          var params = new Array();
          if ($(this).data('param'))
            params.push($(this).data('param'));
          var options = {
            params : params
          };
          if ($(this).data('custom')){
            options.customLink = true;
          }
          if ($(this).data('omniture')){
            options.omniture = true;
          }
          if ($(this).data('ga')){
            options.ga = true;
          }
          if ($(this).data('melt')){
            options.melt = true;
          }
          if ($(this).data('pageview')){
            options.pageView = true;
          }
          $(this).data('tagged', true);
          sections.remove($(this));
          _that.Track(name, options);
        }
      });
		});

		
		//Tagueia o page load
		var load = $("*[data-tag='load']")[0];
		if (!!load){
			var name = $(load).data('name');
			var params = new Array();
			if ($(load).data('param'))
				params.push($(load).data('param'));
			var options = {
				params : params
			};
			if ($(load).data('omniture')){
				options.omniture = true;
			}
			if ($(load).data('ga')){
				options.ga = true;
			}
			if ($(load).data('pageview')){
				options.pageView = true;
			}
			this.Track(name, options);
		}

		this.parsed = true;

	}

};
