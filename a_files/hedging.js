function computeHedge(){
	clearTable();
	var beginDate = new Date(jQuery("#beginDate").val()),
	fullEndDate = new Date(jQuery("#endDate").val()),
	currentRate = Number(jQuery("#currentRate").val()/100),
	currency = Number(jQuery("#currency").val()),
	currName = jQuery("#currName").val(),
	volatility = 0.14,
	strike1 = Number(jQuery("#strike1").val()),
	strike2 = Number(jQuery("#strike2").val()),
	daysInYear = 365,
	USbet = 1.75,
	RUbet = 7.25,
	EUbet = 0,
	endDate = beginDate;

	let i = Math.ceil(daysBetween(fullEndDate, beginDate)/30);
	while(i>0){
		var monthForHedge=daysBetween(endDate, beginDate)/30,
		currencyForward = computeForwardCurrency(beginDate,
			endDate,currentRate,currName,currency,RUbet,USbet,EUbet),
		daysUntillExpiration = daysBetween(endDate, beginDate),
		fullYears=daysUntillExpiration/daysInYear>0 ? daysUntillExpiration/daysInYear : Math.pow(10,-10),
		strike1Val = computeStrike(strike1,currencyForward,volatility,fullYears),
		strike2Val = computeStrike(strike2,currencyForward,volatility,fullYears),
		hedgeValueInCurr = strike1Val.call-strike2Val.put,
		hedgeValuePerCent = hedgeValueInCurr/currency*100,
		hedgeValueForwardInCurr = currencyForward-currency,
		hedgeValueForwardPerCent = hedgeValueForwardInCurr/currency*100;
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(1)").append("<td>"
			+endDate.getDate().toString()+'.'+(endDate.getMonth()+1).toString()+'.'+
			(endDate.getFullYear()).toString()+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(2)").append("<td>"
			+fullYears.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(3)").append("<td>"
			+currentRate+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(4)").append("<td>"
			+currencyForward.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(5)").append("<td>"
			+(volatility*100).toFixed(0)+"%</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(6)").append("<td>"
			+strike1Val.call.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(7)").append("<td>"
			+strike1Val.put.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(8)").append("<td>"
			+strike2Val.call.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(9)").append("<td>"
			+strike2Val.put.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(10)").append("<td>"
			+hedgeValueInCurr.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(11)").append("<td>"
			+hedgeValuePerCent.toFixed(4)+"%</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(12)").append("<td>"
			+hedgeValueForwardInCurr.toFixed(4)+"</td>");
		jQuery("#results > tbody:nth-child(1) > tr:nth-child(13)").append("<td>"
			+hedgeValueForwardPerCent.toFixed(4)+"%</td>");

		if(i==1 && endDate !== fullEndDate){
			i+=1;
			endDate=fullEndDate;
			console.log("adsad");
		}else{
			endDate = addMonths(endDate,1);
		}
		i-=1;
		console.log(endDate === fullEndDate, i);
	};

};

function clearTable(){
	jQuery("#results").empty();
	jQuery("#results").append("<tr><td>Дата исполнения</td></tr>\n<tr><td>Полных лет</td></tr>\n<tr><td>Текущая ставка денежного рынка %%</td></tr>\n<tr><td>Курс валюты</td></tr>\n<tr><td>Волатильность</td></tr>\n<tr><td>Страйк 1: Стоимость опциона Call</td></tr>\n<tr><td>Страйк 1: Стоимость опциона Put</td></tr>\n<tr><td>Страйк 2: Стоимость опциона Call</td></tr>\n<tr><td>Страйк 2: Стоимость опциона Put</td></tr>\n<tr><td>Ст-ть хеджа по связке опционов (Руб за Евро)</td></tr>\n<tr><td>Ст-ть хеджа по связке опционов (в %%)</td></tr>\n<tr><td>Ст-ть хеджа по форварду (Руб за Евро)</td></tr>\n<tr><td>Ст-ть хеджа по форварду (в %%)</td></tr>");
};

function addMonths(startDate,numberOfMonths){
	result = new Date(startDate);
	return new Date(result.setMonth(result.getMonth()+numberOfMonths));
};

function computeForwardCurrency(beginDate,endDate,currentRate,currName,
				currency,RUbet,USbet,EUbet){
	if(beginDate != endDate){
		if(currName == "USD"){			
			return currency+currency*((RUbet-USbet)/100/
				(daysBetween(endDate,beginDate))*365);
		}
		else if(currName == "EUR"){
			return currency+currency*((RUbet-EUbet)/100/
				(daysBetween(endDate,beginDate))*365);
		}
	}
	else{
		return currency;
	}
	return currentRate/365*daysBetween(endDate,beginDate)*currency+currency;
};

function daysBetween(d1,d2){
	return Math.round(Math.abs(d2.valueOf()-d1.valueOf())/864e5);
};

function normalcdf(X){   //HASTINGS.  MAX ERROR = .000001
	var T=1/(1+.2316419*Math.abs(X));
	var D=.3989423*Math.exp(-X*X/2);
	var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (X>0) {
		Prob=1-Prob
	}
	return Prob
};

function normalDistribF(z){
	return Math.pow((2*Math.PI),-0.5)*Math.pow(Math.E,-(z*z)/2);
};

function normalDistrib(X,variant) {
    Z=X;
    M=0;
    SD=1;
    with (Math) {
        if(variant===1)
            Prob=normalDistribF((X));
        else
            Prob=normalcdf((X));
        Prob=round(100000000*Prob)/100000000;
	}
    return Prob;
};

function computeStrike(strike,currency,volatility,fullYears){
	var d1 = (Math.log(currency/strike)+0.5*Math.pow(volatility,2)*
			fullYears)/(volatility*Math.pow(fullYears,0.5)),
		d2 = d1-volatility*Math.pow(fullYears,0.5),
		Nd1 = normalDistrib(d1),	//N(d1)
		Nd2 = normalDistrib(d2),	//N(d2)
		Nfd1 = normalDistribF(d1),	//N'(d1)
		N_d1 = normalDistrib(-d1),	//N(-d1)
		N_d2 = normalDistrib(-d2),	//N(-d2)
		call =currency*Nd1-strike*Nd2,
		put =strike*N_d2-currency*N_d1;
	return {d1: d1, d2:d2, Nd1:Nd1, Nd2:Nd2, Nfd1:Nfd1,
		 N_d1:N_d1, N_d2:N_d2,call:call,put:put};
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