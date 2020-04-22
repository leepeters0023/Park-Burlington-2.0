let script = document.createElement('script')

fetch('./apikey')
  .then((response) => {
    return response.text()
  }).then((apiKey) => {
    let googleReq = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.setAttribute('src', googleReq)
    script.setAttribute('async', true)
    script.setAttribute('defer', true)
    document.body.appendChild(script)
    return script
  })






