export async function getCountryFromCoordinates(lat, lng) {
  // Construimos la URL de Nominatim
  // zoom=3 es suficiente para obtener a nivel de país, lo que hace la petición más rápida
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`;

  try {
    const response = await fetch(url, {
      headers: {
        // Nominatim exige identificar tu app
        'User-Agent': 'Geo ezer/1.0 (miemail@ejemplo.com)' 
      }
    });

    if (!response.ok) {
      throw new Error('Error en la petición a Nominatim');
    }

    const data = await response.json();
    
    // Nominatim devuelve la información del país en address.country
    // y el código en address.country_code
    if (data && data.address) {
    //    console.log("País:", data.address.country);
    //    console.log("Código de país:", data.address.country_code);
       return data.address.country; // ej: "es", "fr", "jp"
    } else {
       console.log("No se encontró país para estas coordenadas (quizás es el océano)");
       return null;
    }

  } catch (error) {
    console.error("Hubo un problema con la geocodificación inversa:", error);
    return null;
  }
}

// Ejemplo de uso con Bilbao:
// getCountryFromCoordinates(43.263, -2.935);