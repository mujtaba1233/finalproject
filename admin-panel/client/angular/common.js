const ADMIN = "admin"
const USER = "user"
function openLink(type,id){
	console.log(type,id);
	"/view-quote/{{q.pdfname}}"
	if(type.indexOf('order') > -1){
		window.open("/view-order/0000000_"+id+'.pdf', '_blank' );
	}else {
		window.open("/view-quote/0000000_"+id+'.pdf', '_blank' );
	}
}
var BarcodeScanerEvents = function() {
	this.initialize.apply(this, arguments);
};

BarcodeScanerEvents.prototype = {
	initialize : function() {
		$(document).on({
			keyup : $.proxy(this._keyup, this)
		});
	},
	_timeoutHandler : 0,
	_inputString : '',
	_keyup : function(e) {
		if (this._timeoutHandler) {
			clearTimeout(this._timeoutHandler);
		}
		this._inputString += String.fromCharCode(e.which);

		this._timeoutHandler = setTimeout($.proxy(function() {
			if (this._inputString.length <= 3) {
				this._inputString = '';
				return;
			}

			$(document).trigger('onbarcodescaned', this._inputString);

			this._inputString = '';

		}, this), 1);
	}
};
toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": true,
	"progressBar": false,
	"positionClass": "toast-bottom-right",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
  }