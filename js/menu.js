addEventListener('load', function () {
    document.getElementById('play').addEventListener('click', function () {
        sessionStorage.removeItem("save");
        window.location.assign("./html/game.html");
    });

    document.getElementById('saves').addEventListener('click', function () {
        fetch("./php/load.php", {
            method: "POST",
            headers: { "content-type": "application/json; charset=UTF-8" }
        })
        .then(response => {
            if (!response.ok) throw new Error("PHP connection failed");
            return response.json();
        })
        .then(partida => {
            if (partida.error) throw new Error(partida.error);
            sessionStorage.save = JSON.stringify(partida);
        })
        .catch(err => {
            console.error(err);
            sessionStorage.save = localStorage.save || "{}";
        })
        .finally(() => window.location.assign("./html/game.html"));
    });

    document.getElementById('options').addEventListener('click', function () {
        window.location.assign("./html/options.html");
    });

    document.getElementById('exit').addEventListener('click', function () {
        console.warn("No es pot sortir!");
    });
});
