function computeForward(){
	var beginDate = new Date(jQuery("#beginDate").val()),
	endDate = new Date(jQuery("#endDate").val()),
	currName = jQuery("#currName").val(),
	currencyValue = Number(jQuery("#currencyValue").val()),
	RUbet = Number(jQuery("#RUbet").val()),
	EUbet = Number(jQuery("#EUbet").val()),
    USbet = Number(jQuery("#USbet").val());

    var res = computeForwardCurrency(beginDate,endDate,currName,
        currencyValue,RUbet,USbet,EUbet);
    jQuery("#forwResult").text("Индикативный курс на конечную дату: "+ res.toFixed(4))
};

function computeForwardCurrency(beginDate,endDate,currName,
    currencyValue,RUbet,USbet,EUbet){
    if(beginDate != endDate){
        if(currName == "USD"){			
        return currencyValue+currencyValue*((RUbet-USbet)/100/
            (daysBetween(endDate,beginDate))*365);
        }
        else if(currName == "EUR"){
        return currencyValue+currencyValue*((RUbet-EUbet)/100/
            (daysBetween(endDate,beginDate))*365);
        }
    }
    else{
        return currency;
    }
};


function daysBetween(d1,d2){
	return Math.round(Math.abs(d2.valueOf()-d1.valueOf())/864e5);
};


addEventListener('DOMContentLoaded', function () {
    pickmeup('input#beginDate', {
        position       	: 'right',
        hide_on_select 	: true,
        format			: 'Y-m-d'
    });
    pickmeup('input#endDate', {
        position       	: 'right',
        hide_on_select 	: true,
        format			: 'Y-m-d',
        default_date	: false
    });
});