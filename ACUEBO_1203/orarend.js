var x = document.getElementById("hidden_content");
var y = document.getElementById("tartalom");
x.style.display="none";
function myFunction() {
if (x.style.display === "none") 
{
    x.style.display = "block";
    y.style.display= "none";
} 
else 
{
    x.style.display = "none";
    y.style.display="block"; 
}
}