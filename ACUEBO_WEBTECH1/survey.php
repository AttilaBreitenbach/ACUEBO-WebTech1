<html>
<body>
    <h2>YOur answ</h2>
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $nev = $_POST["name"];
        $mail = $_POST["mail"];
        $country = $_POST["country"];
        $uzenet = $_POST["message"];
        echo $nev;
        //echo "Név: ".$nev."E-mail: ".$mail."Ország: ".$country."Észrevétel: ".$uzenet;
    }
    ?>
</body>
</html>