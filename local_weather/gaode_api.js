

/*
Code by Ye Wang
*/
var cityname ="";
var userkey = "";
var url = "";

function localweather(url)
{
    xmlhttp=null;
    if (window.XMLHttpRequest)
    {// code for IE7, Firefox, Opera, etc.
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {

        xmlhttp.open("GET",url,true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange=state_Change;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }

}
function state_Change()
{
    if (xmlhttp.readyState==4)
    {// 4 = "loaded"
        if (xmlhttp.status==200)
        {// 200 = "OK"

            // document.getElementById('weatherdata').innerHTML=xmlhttp.responseText;
            var jsonText = xmlhttp.responseText;
            var  returnValue = eval("(" + jsonText + ")");
            document.getElementById('province').innerHTML= returnValue.lives[0].province;
            document.getElementById('city').innerHTML= returnValue.lives[0].city;
            document.getElementById('weather').innerHTML= returnValue.lives[0].weather;
            document.getElementById('temperature').innerHTML= returnValue.lives[0].temperature;
            document.getElementById('winddirection').innerHTML= returnValue.lives[0].winddirection;
            document.getElementById('windpower').innerHTML= returnValue.lives[0].windpower;
            document.getElementById('humidity').innerHTML= returnValue.lives[0].humidity;
            document.getElementById('reporttime').innerHTML= returnValue.lives[0].reporttime;

        }
        else
        {
            alert("Problem retrieving XML data:" + xmlhttp.statusText);
        }
    }
}
$("#submit").click(function(){
    cityname =$("#cityname").val();
    userkey = $("#userkey").val();
    url = "http://restapi.amap.com/v3/weather/weatherInfo?city=" + cityname +"&key=" + userkey;
    localweather(url);
});



