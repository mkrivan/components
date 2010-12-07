(function ($, rf) {
	
	rf.ui = rf.ui || {};
    
	rf.ui.InplaceSelect =  function(id, options) {
       	var mergedOptions = $.extend({}, defaultOptions, options);
       	$super.constructor.call(this, id, mergedOptions)
      	this.getInput().bind("click", $.proxy(this.__clickHandler, this));
       	mergedOptions['attachTo'] = id;
       	mergedOptions['scrollContainer'] = $(document.getElementById(id + "Items")).parent()[0];
    	this.popupList = new rf.ui.PopupList(id+"List", this, mergedOptions);
    	this.items = mergedOptions.items;
    	this.selValueInput = $(document.getElementById(id+"selValue"));
    	this.list = $(document.getElementById(id+"List"));
    	this.list.bind("mousedown", $.proxy(this.__onListMouseDown, this));
    	this.list.bind("mouseup", $.proxy(this.__onListMouseUp, this));
    	this.openOnEdit = mergedOptions.openOnEdit;
    	this.saveOnSelect = mergedOptions.saveOnSelect;
    	this.savedIndex = -1;
    }
	
    rf.ui.InplaceInput.extend(rf.ui.InplaceSelect);
	var $super = rf.ui.InplaceSelect.$super;
	
	var defaultOptions = {
    	defaultLabel: "",
    	saveOnSelect: true,
    	openOnEdit: true,
    	showControl: false,
    	itemCss: "rf-is-opt",
    	selectItemCss: "rf-is-sel", 
    	listCss: "rf-is-lst-cord",
    	noneCss: "rf-is-none",
	    editCss: "rf-is-edit", 
	    changedCss: "rf-is-c-s"
	};

	
	$.extend(rf.ui.InplaceSelect.prototype, ( function () {
		
		return{
			name : "inplaceSelect",
			
			getName: function() {
				return this.name;
			},
			
			geNamespace: function() {
				return this.namespace;
			},
			
			onshow: function() {
				$super.onshow.call(this);
				if(this.openOnEdit) {
					this.showPopup();
				}
			},
			
			onhide: function() {
				this.hidePopup();
			},
			
			showPopup: function() {
				this.popupList.show();
			},
			
			hidePopup: function() {
				this.popupList.hide();
			},
			
       		onsave: function() {
				var item = this.popupList.currentSelectItem();
				if(item) {
					this.savedIndex = this.popupList.getSelectedItemIndex();
					var value = this.getItemValue(item);
					this.saveItemValue(value);
				}	
       		},
       		
       		oncancel: function() {
       			var prevItem = this.popupList.getItemByIndex(this.savedIndex);
       			if(prevItem) {
       				var value = this.getItemValue(prevItem);
       				this.saveItemValue(value);
       			}
       		},
       		
			onblur: function() {
				this.hidePopup();
				$super.onblur.call(this);
			},
		
			processItem: function(item) {
				var label = this.getItemLabel(item);
				this.setValue(label);
           		
				this.__setInputFocus();
           		this.hidePopup();
           		
           		if(this.saveOnSelect) {
       				this.save();
				}
			},
			
			getItemValue: function(item) {
				var key = $(item).attr("id");

				var value;
				$.each(this.items, function(){ 
						if (this.id == key) {
							value = this.value;
							return false;
						}	
				});
				
				return value;				
			}, 
			
			saveItemValue: function(value) {
				this.selValueInput.val(value);
			},
			
			getItemLabel: function(item) {
				var key = $(item).attr("id");
				var label;
				$.each(this.items, function(){ 
						if (this.id == key) {
							label = this.label;
							return false;
						}	
				});
				
				return label;
			}, 
			
       		__keydownHandler: function(e) {
				
				var code; 
				
				if(e.keyCode) {
					code = e.keyCode;
				} else if(e.which) {
					code = e.which;
				}
       			
				if(this.popupList.isVisible()) {
	       			switch(code) {
	       				case rf.KEYS.DOWN: 
	       					e.preventDefault();
	       					this.popupList.__selectNext(); 
	       	           		this.__setInputFocus();
	       					break;
	       				
	       				case rf.KEYS.UP:
	       					e.preventDefault();
	       					this.popupList.__selectPrev();
	       	           		this.__setInputFocus();
	       					break;
	       				
	       				case rf.KEYS.RETURN:
	       					e.preventDefault();
	       					this.popupList.__selectCurrent();
	       	           		this.__setInputFocus();
	       					return false;
	       					break;
	   				}
				}
       			
				$super.__keydownHandler.call(this,e);
			},
			
			__blurHandler: function(e) {
				if(!this.isMouseDown) {
					if(this.isEditState()) {
						this.timeoutId = window.setTimeout($.proxy(function(){
							this.onblur();
						}, this), 200);
					}	
				} else {
					this.__setInputFocus();
	       			this.isMouseDown = false;
				}
       		}, 
       		
       		__clickHandler: function(e) {
       			this.showPopup();
       		},

       		__onListMouseDown: function(e) {
       			this.isMouseDown = true;
       		},
       		
       		__onListMouseUp: function(e) {
       			this.isMouseDown = false;
       			this.__setInputFocus();
       		}
		}
		
	})());

})(jQuery, window.RichFaces);
