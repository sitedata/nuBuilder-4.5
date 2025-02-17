function nuEditPHP(type) {
	nuForm('nuphp', nuCurrentProperties().form_id + '_' + type, 'justphp', '', 2);	
}

function nuOpenCurrentFormProperties() {
	nuForm('nuform', window.nuFORM.getCurrent().form_id, '', '', 2);
}

function nuOpenCurrentObjectList() {
	nuForm('nuobject','',window.nuFORM.getCurrent().form_id,'',2);
}

function nuAddAdminButton(i, v, f, t) {

	if (typeof t === 'undefined') {
		var t = '';
	}

	var button = "<input id='nu" + i + "Button' type='button' type='button' title='" + nuTranslate(t) + "' class='nuActionButton nuAdminButton' value='" + nuTranslate(v) + "' onclick='" + f + "'>";
	$('#nuActionHolder').prepend(button);

}

function nuShowFormInfo() {

	var cp = nuCurrentProperties();
	var code = nuCurrentProperties().form_code;
	var devMode = nuDevMode();

	var recordId = nuFormType() == 'edit' && cp.form_type !== 'launch' ? "<b>Record ID:</b> " + cp.record_id : '';
	var browseSQL = nuFormType() == 'browse' && (! code.startsWith('nu') || devMode) ? "<b>Browse SQL:</b></br> " + cp.browse_sql : '';
	var table = nuSERVERRESPONSE.table !== '' && (! code.startsWith('nu') || devMode) ? "<b>Table:</b> " + nuSERVERRESPONSE.table : '';

	nuMessage(["<h2><u>" + cp.form_description + "</u></h2>", "<b>Form ID:</b> " + cp.form_id, "<b>Form Code:</b> " + cp.form_code, table, recordId, browseSQL]);
	
}

function nuDevMode(m) {

	if (typeof m !== 'undefined') {
		if (m === true) localStorage.setItem("nuDevMode", '1');
		if (m === false) localStorage.setItem("nuDevMode", '0');
	}

	var d = localStorage.getItem("nuDevMode");
	if ((d === '1' || d === true) && nuGlobalAccess()) {
		nuSetProperty('nuDevMode', '1', true);
		return true;
	} 
	if (m === false) {
		nuSetProperty('nuDevMode', '0', true);
	}

	return false;
}

function nuAddAdminButtons() {

	if (nuGlobalAccess()) {

		var ft = nuCurrentProperties().form_type;
		if (ft === null || typeof ft === 'undefined') return;

		var devMode = nuDevMode();

		var b = ft.indexOf("browse") >= 0;
		var e = ft.indexOf("edit") >= 0;
		var l = ft.indexOf("launch") >= 0;

		if ((nuAdminButtons["nuDebug"] || devMode) && nuMainForm()) nuAddIconToBreadcrumbHolder('nuDebugButton','nuDebug Results','nuOpenNuDebug(2)','fa fa-bug','0px');
		if (nuFormType() !== 'browse' && nuAdminButtons["nuRefresh"]) nuAddIconToBreadcrumbHolder('nuRefreshButton','Refresh','nuGetBreadcrumb()','fa fa-refresh', '7px');

		var c = 0;
		var code = nuCurrentProperties().form_code;
		if (! code.startsWith('nu') || devMode) {

			if (nuAdminButtons["nuProperties"]) {c++; nuAddAdminButton("AdminProperties", "Prop", 'nuOpenCurrentFormProperties();',nuTranslate('Form Properties'));}
			if (nuAdminButtons["nuObjects"]) {c++; nuAddAdminButton("AdminObjectList", "Obj", 'nuOpenCurrentObjectList();',nuTranslate('Object List'));}

			if (e || l) {c++; nuAddAdminButton("AdminBE", "BE", 'nuEditPHP("BE");','Before Edit'); }
			if (b) {c++; nuAddAdminButton("AdminBB", "BB", 'nuEditPHP("BB");','Before Browse'); }
			if (e) {c++; nuAddAdminButton("AdminBS", "BS", 'nuEditPHP("BS");','Before Save'); }
			if (e) {c++; nuAddAdminButton("AdminAS", "AS", 'nuEditPHP("AS");','After Save'); }
		}

		if (c > 0) $('#nuActionHolder').css('height', '50px');

		// if ( window.location === window.parent.location ) {

			var frame = parent.$('#nuDragDialog iframe')
			frame.css('height', frame.cssNumber("height") + 50);

			var dragDialog = parent.$('#nuDragDialog')
			dragDialog.css('height', dragDialog.cssNumber("height") + 50);

		// }	

		$("<br>").insertAfter($("#nuAdminPropertiesButton"));
	}

}

// Set Browse Column Widths in a Browse Screen

function nuRoundNearest(n, v) {

	n = n / v;
	n = Math.round(n) * v;
	return n;
}

function nuSetBrowseColumnWidths() {

	if (confirm(nuTranslate("Copy Column Widths from the Browse Table (Overwrite existing values)?"))) {

		var sf = nuSubformObject('zzzzsys_browse_sf');
		for (var i = 0; i < sf.rows.length; i++) {

			if (sf.deleted[i] == 0) {
				var c = $("div[id='nuBrowseTitle" + i + "']", window.parent.document);
				var w = Math.ceil(nuRoundNearest(parseFloat(c[0].style.width), 5)).toString();
				$('#' + 'zzzzsys_browse_sf' + nuPad3(i) + 'sbr_width').val(w.replace('px', '')).change();
			}

		}
	}

}

function nuInitSetBrowseWidthHelper() {

	if (parent.window.nuDocumentID === undefined) return;

	if (! nuMainForm() && nuCurrentProperties().form_id == 'nuform' && window.parent.nuFormType() == 'browse') {
		if (window.location != window.parent.location) {

			var w = $('#title_zzzzsys_browse_sfsbr_width');

			if (w.length == 1) {
				w.css({
					"text-decoration": "underline",
					"text-decoration-style": "dashed",
					"color": "blue"
				});

				w.prop('onclick', null).off('click');
				w.click(function (e) {
					nuSetBrowseColumnWidths();
				});
			}
		}
	}

} 

function nuOpenPropertiesOnMiddleClick(e) {

	if (nuGlobalAccess()) {

		if (e.button === 1) {

			var id = e.target.id;

			if (id == "nubody" || id == "nuRECORD" || id == "nuhtml") {
				// Form Properties
				nuForm('nuform', window.nuFORM.getCurrent().form_id, '', '', 2);
			} else {
				var objId = nuObjectIdFromId(e.target.id);
				if (objId !== null) {
					// Object Properties
					nuForm('nuobject', objId, '', '', '2');
				} 
			}
		}
	}

}

function nuSetSnippetFormFilter(custom, setup, sql, php) {

	nuSetProperty('IS_CUSTOM_CODE',custom);
	nuSetProperty('IS_SETUP_HEADER',setup);    
	nuSetProperty('IS_SQL',sql);
	nuSetProperty('IS_PHP',php);

}

function nuOpenNuDebug(w) {
	nuForm('nudebug','','','',w);
}

function nuAddIconToBreadcrumbHolder(i, title, oClick, iClass, paddingLeft) {

	var h = "<div id='"+i+"' title='"+title+"' style='font-size: 16px; display: inline-block; cursor : pointer; padding-right:8px; padding-left:"+paddingLeft+"' onclick='"+oClick+"'><i class='"+iClass+"'></i>&nbsp;" + '' + "</div>";

	var fragment = nuCreateAppendHTML(h);
	if (window.nuFORM.breadcrumbs.length == 1) { 
		var options = $('#nuBreadcrumbHolder').find("[id$=nuOptions]");
		$(fragment).insertAfter(options); 
	} else 
	{
		$(fragment).insertBefore("#nuBreadcrumb0");  
	}

}

function nuShowObjectTooltip() {

	if (nuGlobalAccess()) {

		$("*").each(function() {
			var id = $(this).attr('id');
			if (id !== undefined) {
				$(this).attr('title', 'ID: ' + id);
			}
		});

	}
}

var contextMenuCurrentTarget = null;

var menuAlign =
	{
		text: "Align",
		tag: "Align",
		subMenu: [
			{
				text: nuContextMenuItemText("Left", "fa fa-align-left"),
				tag: "Left",
				faicon: "fa fa-align-left",
				action: () => nuContextMenuUpdateAlign("left"),
			},
			{
				text: nuContextMenuItemText("Right", "fa fa-align-right"),
				tag: "Right",
				faicon: "fa fa-align-right",
				action: () => nuContextMenuUpdateAlign("right"),
			},
			{
				text: nuContextMenuItemText("Center", "fa fa-align-center"),
				tag: "Center",
				faicon: "fa fa-align-center",
				action: () => nuContextMenuUpdateAlign("center"),
			},
		],
	};

var menuObject =
	{ 
		text: "",
		tag: "Object",
		action: function (e) { nuContextMenuCopyIdToClipboard(); }
	};

var menuClone =
	{
		text: "",
		tag: "Clone",
		action: function (e) { nuContextMenuClone(); }
	};

var menuProperties =
	{
		text: "Properties...",
		tag: "Properties",
		action: function (e) { nuContextMenuObjectPopup(); }
	};

var menuRename =
	{
		text: "Rename...",
		action: () => nuContextMenuLabelPrompt(),
	};

var subMenuHidden = 

	{
		text: nuContextMenuItemText("Hidden", "fa fa-eye-slash"),
		tag: "Hidden",
		faicon: "fa fa-eye-slash",
		action: () => nuContextMenuUpdateAccess(2),
	};

var subMenuHiddenUser = 
	
	{
		text: nuContextMenuItemText("Hidden (User)", "fa fa-eye-slash"),
		tag: "Hidden (User)",
		faicon: "fa fa-eye-slash",
		action: () => nuContextMenuUpdateAccess(3),
	};

var menuAccess = 
	{
		text: "Access",
		tag: "Access",
		subMenu: [
			{
				text: nuContextMenuItemText("Editable", "fa fa-pencil-square-o"),
				tag: "Editable",
				faicon: "fa fa-pencil-square-o",
				action: () => nuContextMenuUpdateAccess(0),
			},
			{
				text: nuContextMenuItemText("Readonly", "fa fa-lock"),
				tag: "Readonly",
				faicon: "fa fa-lock",
				action: () => nuContextMenuUpdateAccess(1),
			},
			subMenuHidden,
			subMenuHiddenUser
		]
	};

var menuValidation =
	{
		text: "Validation",
		tag: "Validation",	
		disabled: false,	
		subMenu: [
			{
				text: nuContextMenuItemText("None", "fa fa-globe"),
				tag: "None",
				faicon: "fa fa-globe",
				action: () => nuContextMenuUpdateValidation(0),
			},
			{
				text: nuContextMenuItemText("No Blanks", "fa fa-battery-full"),
				tag: "No Blanks",
				faicon: "fa fa-battery-full",
				action: () => nuContextMenuUpdateValidation(1),
			},
			{
				text: nuContextMenuItemText("No Duplicates", "fa fa-diamond"),
				tag: "No Duplicates",
				faicon: "fa fa-diamond",
				action: () => nuContextMenuUpdateValidation(2),
			},
			{
				text: nuContextMenuItemText("No Duplicates/Blanks", "fa fa-star"),
				tag: "No Duplicates/Blanks",
				faicon: "fa fa-star",
				action: () => nuContextMenuUpdateValidation(3),
			},
		],
	};
	
var nuContextMenuDefinitionEdit = [

	menuObject,
	{ isDivider: true },
	menuProperties,
	menuRename,	
	{ isDivider: true },
	menuAccess,	
	menuAlign,
	menuValidation,	
	{ isDivider: true },

	{
		html: "",
		tag: "Top"
	},
	{
		html: "",
		tag: "Left"
	},
	{
		html: "",
		tag: "Width"
	},
	{
		html: "",
		tag: "Height"
	}
];

var nuContextMenuDefinitionBrowse = [

	menuObject,
	{ isDivider: true },
	menuRename,	
	{ isDivider: true },
	menuAlign,
	{ isDivider: true },
	{
		html: "",
		tag: "Width"
	}

];

var nuContextMenuDefinitionTab = [

	menuObject,
	{ isDivider: true },
	menuRename,
	
	{
		text: "Access",
		tag: "Access",
		subMenu: [
			subMenuHidden,
			subMenuHiddenUser
		]

	}

];

var nuContextMenuDefinitionSubform = [

	menuObject,
	{ isDivider: true },
	menuRename,	

/*	
	menuAlign

	{ isDivider: true },
	{
		html: "",
		tag: "Width"
	}
*/	

];

function nuContextMenuBold(text) {
	return '<b>' + text + '</b>';
}

function nuContextLabelHasClass(id, className) {
	return $('#label_' + id).hasClass(className);
}

function nuContextMenuIdHasAlgin(id, align) {

	if (nuFormType() == 'browse') id = nuContextMenuCurrentTargetBrowseId(id);
	id = $('#' + id).hasClass('nuContentBoxContainer') ? 'label_' + id : id;

	return $('#' + id).css('text-align').toLowerCase() == align.toLowerCase();

}

function nuContextMenuAlignText(id, sub, align) {
	return nuContextMenuIdHasAlgin(id, align) ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuAccessText(id, sub, access) {
	return $('#' + id).attr('data-nu-access') == access ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuPositionText(id, position) {

	if (nuFormType() == 'browse') id = nuContextMenuCurrentTargetBrowseId(id);

	if ($('#' + id).hasClass('nuContentBoxContainer') && (position == 'Height' || position == 'Width'))	 {
			id = 'content_' + id;
	}

	return nuContextMenuItemPosition(position, $('#' + id).cssNumber(position));

}

function nuContextMenuValidationText(id, sub, validation) {
	return nuContextLabelHasClass(id, validation) ? nuContextMenuItemText(nuContextMenuBold(sub.tag), sub.faicon) : nuContextMenuItemText(sub.tag, sub.faicon);
}

function nuContextMenuBeforeRender(menu, event) {

	contextMenuCurrentTarget = event.currentTarget;
	let id = contextMenuCurrentTargetId();
	let isButton = $('#' + contextMenuCurrentTarget.id).is(":button");
	let isSelect = $('#' + contextMenuCurrentTargetUpdateId()).is("select");

	for (let i = 0; i < menu.length; i++) {
		if (menu[i].hasOwnProperty('tag')) {

			if (menu[i].tag == 'Top') menu[i].html = nuContextMenuPositionText(id, 'Top');
			if (menu[i].tag == 'Left') menu[i].html = nuContextMenuPositionText(id, 'Left');
			if (menu[i].tag == 'Width') menu[i].html = nuContextMenuPositionText(id, 'Width');
			if (menu[i].tag == 'Height') menu[i].html = nuContextMenuPositionText(id, 'Height');
			if (menu[i].tag == 'Object') menu[i].text = "Object: " + (nuFormType() == 'edit' ? contextMenuCurrentTargetUpdateId() : nuContextMenuCurrentTargetBrowseId());

			if (menu[i].tag == 'Access') { 
				for (let j = 0; j <  menu[i].subMenu.length; j++) {
					let sub = menu[i].subMenu[j];
					if (sub.tag == 'Editable') { 
						sub.text = nuContextMenuAccessText(id, sub, '0');
					} else if (sub.tag == 'Readonly') {
						sub.text = nuContextMenuAccessText(id, sub, '1');
					} else if (sub.tag == 'Hidden') {
						sub.text = nuContextMenuAccessText(id, sub, '2');
					} else if (sub.tag == 'Hidden (User)') {
						sub.text = nuContextMenuAccessText(id, sub, '3');
					}
				}
			} else	if (menu[i].tag == 'Align') { 
				menu[i].disabled = isSelect;
				if (!isSelect) {
					for (let j = 0; j <  menu[i].subMenu.length; j++) {
						let sub = menu[i].subMenu[j];
						sub.text = nuContextMenuAlignText(id, sub, sub.tag)
					}
				}
			} else	if (menu[i].tag == 'Validation') { 
				menu[i].disabled = isButton;
				for (let j = 0; j <  menu[i].subMenu.length; j++) {
					let sub = menu[i].subMenu[j];
					if (sub.tag == 'No Blanks') { 
						sub.text = nuContextMenuValidationText(id, sub, 'nuBlank');
					} else if (sub.tag == 'No Duplicates') {
						sub.text = nuContextMenuValidationText(id, sub, 'nuDuplicate');
					} else if (sub.tag == 'No Duplicates/Blanks') {
						sub.text = nuContextMenuValidationText(id, sub, 'nuDuplicateOrBlank');
					} else if (sub.tag == 'None') {
						sub.text = nuContextMenuValidationText(id, sub, 'nuNone');
					}
				}
			}

		}
	}

	$('#' + id).focus();
	
	setTimeout(function(){ $('.ctxmenu').css('top', $('.ctxmenu').cssNumber('top') + 20 + 'px');}, 5);

	return menu;

}

function nuContextMenuItemText(label, iconClass) {
	return '<i class="' + iconClass + ' fa-fw" aria-hidden="true"></i> <span style="padding-left:8px; white-space:nowrap; display: inline;">' + label + '</span>';
}

function nuContextMenuGetWordWidth(w){

	var h = "<div id='nuTestWidth' style='font-size:13px;position:absolute;visible:hidden;width:auto'>" + w + "</div>";
	$('body').append(h);
	var l = parseInt($('#nuTestWidth').css('width'));
	$('#nuTestWidth').remove();

	return l + 5;

}

function nuContextMenuItemPositionChanged(t, update) {

	if (t.value.trim() == '' || Number(t.value) < 0) return;

	let id = contextMenuCurrentTargetId();
	let prop = $(t).attr("data-property").toLowerCase();
	let typeEdit = nuFormType() == 'edit';

	if (update) {
		nuContextMenuUpdateObject(t.value, typeEdit ? 'sob_all_' + prop : 'sbr_' + prop);
	} else {
		if (typeEdit) {

			if ((prop == 'width' || prop == 'height') && $('#' + id).hasClass('nuContentBoxContainer')) {
				$('#content_' + id).css(prop, t.value + 'px');
			} else {
				$('#' + id).css(prop, t.value + 'px');
			}	

			nuContextMenuUpdateLabel(id);
		} else {
			nuSetBrowseColumnSize(Number(contextMenuCurrentTargetUpdateId().justNumbers()), Number(t.value));
		}
	}

}

function nuContextMenuItemPosition(label, v) {

	var lwidth = nuContextMenuGetWordWidth(label);
	var left = 70 - lwidth + 17;
	if (label == 'Top') left += 2;
	if (label == 'Left') left += 1;	
	if (label == 'Height') left -= 1;	

	return '<span style="width: 100px; padding-left:20px; font-family: font-family: Verdana, sans-serif;white-space:nowrap; display: inline;">' + label + '</span>' +
	' <input data-property="' + label + '" onChange="nuContextMenuItemPositionChanged(this, false)" onBlur="nuContextMenuItemPositionChanged(this, true)" style="text-align: right; margin: 3px 10px 3px ' + left +'px; width: 50px; height: 22px" type="number" min="0" class="input_number" value="' + v + '"> </input>';

}

function nuContextMenuUpdateAccess(v) {

	let id = contextMenuCurrentTargetId();
	if (v == 0) { 				//-- editable
		nuEnable(id);
		nuShow(id);
	} else if (v == 1) { 		//-- readonly
		nuDisable(id);
	} else if (v == 2) { 		//-- hidden
		nuHide(id);
	}

	$('#' + id).attr('data-nu-access', v);
	
	let column = $('#' + id).hasClass('nuTab') ? 'syt_access' : 'sob_all_access';
	nuContextMenuUpdateObject(v, column);
}

function nuContextMenuUpdateAlign(v) {

	let ftEdit = nuFormType() == 'edit';
	let id = ftEdit ? contextMenuCurrentTargetUpdateId.id : nuContextMenuCurrentTargetBrowseId(contextMenuCurrentTarget.id);

	$('#' + id).css('text-align', v);

	if (ftEdit) {
		nuContextMenuUpdateObject(v, 'sob_all_align');
	} else {
		
		let colNumber = id.replace('nuBrowseTitle','');
		$('[data-nu-column="'+colNumber+'"]').each(function(index) {     
			$(this).css('text-align', v) 
		});

		nuContextMenuUpdateObject(v.toLowerCase().charAt(0), 'sbr_align');
	}

}

function nuContextMenuUpdateValidation(v) {

	let id = contextMenuCurrentTargetId();
	let objLabel = $('#label_'+ id);

	if (v == 0) {														//-- none
		objLabel.removeClass('nuBlank nuDuplicate nuDuplicateOrBlank');
		objLabel.addClass('nuNone');
	} else if (v == 1) {												//-- no blanks
		objLabel.removeClass('nuNone nuDuplicate nuDuplicateOrBlank');
		objLabel.addClass('nuBlank');
	} else if (v == 2) {												//-- no duplicates
		objLabel.addClass('nuDuplicate');
		objLabel.removeClass('nuNone nuBlank nuDuplicateOrBlank');
	} else if (v == 3) {												//-- no duplicates/blanks
		objLabel.addClass('nuDuplicateOrBlank');
		objLabel.removeClass('nuNone nuBlank nuDuplicate');
	}

	nuContextMenuUpdateLabel(id);
	nuContextMenuUpdateObject(v, 'sob_all_validate');

}

function nuContextMenuUpdateLabel(id) {

	var objLabel = $('#label_' + id);

	if (objLabel.hasClass('nuContentBoxTitle')) return;

	var label = objLabel.html();
	var lwidth = nuGetWordWidth(label);

	objLabel.css({
		left: $('#' + id).cssNumber('left') - lwidth - 17,
		top: $('#' + id).cssNumber('top'),
		width: Number(lwidth + 12)
	});

}

function nuContextMenuGetFormId(id) {

	let subform = $('#' + contextMenuCurrentTargetId()).attr('data-nu-subform');
	if (subform) {
		return $('#' + subform + '000nuRECORD').attr('data-nu-form-id');
	} else if (nuFormType() == 'edit') {
		let field = $('[data-nu-field="'+ id +'"]');
		let obj = $('#' + id);
		return id == field || obj.hasClass('nuWord') || obj.hasClass('nuImage') || obj.hasClass('nuContentBoxContainer') || obj.hasClass('nuHtml') || obj.is(":button") ? obj.parent().attr('data-nu-form-id') : field.parent().attr('data-nu-form-id');
	} else {
		return nuCurrentProperties().form_id;
	}

}

function nuContextMenuLabelPromptCallback(value, ok) {

	if (ok) { 

		let objLabel = $('#' + contextMenuCurrentTarget.id);
		objLabel.html(value);

		let column = nuFormType() == 'edit' ? 'sob_all_label' : 'sbr_title';
		column = objLabel.hasClass('nuTab') ? 'syt_title' : column;

		nuContextMenuUpdateObject(value, column);

	}

}

function nuContextMenuLabelPrompt() {

	let label = contextMenuCurrentTarget.id;
	let id = contextMenuCurrentTargetId();
	let obj = $('#' + contextMenuCurrentTarget.id);
	
	let value =	obj.is(":button") ? obj.val() : $('#'+label).html();
	value = obj.is(":button") && obj.attr('data-nu-label') ? obj.html() : value;

	value = nuFormType() == 'edit' ? value : value.trim();

	nuPrompt(nuTranslate("Label") + ':', nuTranslate("Object") + ': ' +	id, value, '', 'nuContextMenuLabelPromptCallback');

}

function contextMenuCurrentTargetUpdateId() {

	let t = $('#' + contextMenuCurrentTarget.id);
	if (t.is(":button") || t.hasClass('nuWord') || t.hasClass('nuImage') || t.hasClass('nuSort') || t.hasClass('nuTab')) {
		return contextMenuCurrentTarget.id;
	} else {

		let idNoLabel = $('#' + contextMenuCurrentTarget.id.substring(6));
		if (idNoLabel.hasClass('nuHtml') || idNoLabel.hasClass('nuContentBoxContainer')) {
			return idNoLabel.attr('id');
		}

		let id = t.hasClass('nuSubformTitle') ?  t.attr('data-nu-field') : idNoLabel.attr('data-nu-field');
		id = id === undefined ? contextMenuCurrentTarget.id : id;
		return id;
	}

}

function contextMenuCurrentTargetId() {

	let t = $('#' + contextMenuCurrentTarget.id);
	return t.is(":button") || t.hasClass('nuWord') || t.hasClass('nuImage') || t.hasClass('nuTab') || t.hasClass('nuSubformTitle') || t.hasClass('nuSort') || t.hasClass('nuSubformTitle') ? contextMenuCurrentTarget.id : contextMenuCurrentTarget.id.substring(6);

}

function nuContextMenuCurrentTargetBrowseId() {
	
	let id = contextMenuCurrentTarget.id;
	return $('#' + id).parent().attr('id')

}

function nuContextMenuCopyIdToClipboard() {
	nuCopyToClipboard(contextMenuCurrentTargetId());
}

function nuContextMenuClone() {

}

function nuContextMenuObjectPopup() {
	nuPopup("nuobject", nuObjectIdFromId(contextMenuCurrentTargetUpdateId()) ,"");
}

function nuContextMenuUpdateObject(value, column) {

	let isTab = $('#' + contextMenuCurrentTargetId()).hasClass('nuTab');
	let id = nuFormType() == 'edit' && !isTab ? contextMenuCurrentTargetUpdateId() : nuPad2((Number(contextMenuCurrentTargetUpdateId().justNumbers()) + 1) * 10);

	let formId = nuContextMenuGetFormId(id);
	let p = 'nuupdateobject';

	nuSetProperty(p + '_id', isTab ?  $('#' + contextMenuCurrentTargetId()).attr('data-nu-tab-id') : id);
	nuSetProperty(p + '_value', value);
	nuSetProperty(p + '_form_id', formId);
	nuSetProperty(p + '_type', isTab ? 'tab' : nuFormType());	
	nuSetProperty(p + '_column', column);
	nuRunPHPHidden(p, 0);

}

function nuContextMenuUpdate() {

	let typeEdit = nuFormType() == 'edit';
	let selector =  typeEdit ? 'label, button, .nuWord, .nuImage, .nuContentBoxTitle, .nuTab, .nuSubformTitle' : '.nuSort';

	$(selector).each((index, element) => {

		let el = "#"+ element.id;
		if (el !== '#' && $(el).length > 0) {

			if ($(el).hasClass('nuTab')) {
				ctxmenu.update(el, nuContextMenuDefinitionTab, nuContextMenuBeforeRender);
			} else if ($(el).hasClass('nuSubformTitle')) {
				ctxmenu.update(el, nuContextMenuDefinitionSubform, nuContextMenuBeforeRender);
			} else {
				ctxmenu.update(el, typeEdit ? nuContextMenuDefinitionEdit : nuContextMenuDefinitionBrowse, nuContextMenuBeforeRender);				
			}
		}

	});

}

function nuContextMenuClose() {

	if (typeof ctxmenu !== "undefined") {
		ctxmenu.closeMenu();
	}

}