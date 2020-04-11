function apiKeyURL() {
    document.createElement("<script src=\'https://maps.googleapis.com/maps/api/js?key=$" + process.env.API_KEY + "&libraries=places&callback=initMap\'
    async defer></script>")
