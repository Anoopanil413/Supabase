import React, { useEffect, useState } from 'react';

const LocationData = () => {
  const [ip, setIp] = useState('');
  const [freeIp, setFreeIp] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState('');
//   useEffect(() => {
//     const fetchIpUsingWebRTC = () => {
//         if (!window.RTCPeerConnection) return;
      
//         const pc = new RTCPeerConnection({
//           iceServers: [
//             { urls: "stun:stun.l.google.com:19302" },
//             { urls: "stun:stun1.l.google.com:19302" },
//             { urls: "stun:stun2.l.google.com:19302" },
//             { urls: "stun:stun3.l.google.com:19302" },
//             { urls: "stun:stun4.l.google.com:19302" },
//           ],
//         });
      
//         pc.createDataChannel(""); // Create a bogus data channel
//         pc.createOffer()
//           .then((offer) => pc.setLocalDescription(offer))
//           .catch((error) => console.error("Error creating offer:", error));
      
//         pc.onicecandidate = (ice) => {
//           const candidate = ice?.candidate?.candidate;
//           console.log("ICE candidate:", candidate);
      
//           if (candidate && !candidate.includes(".local")) {
//             const ipMatch = candidate.match(
//               /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
//             );
//             const myIP = ipMatch?.[1];
//             if (myIP) {
//               console.log("User IP:", myIP);
//               setIp(myIP);
//               // fetchLocation(myIP); // Uncomment if needed to fetch location based on IP
//             }
//           }
//           pc.onicecandidate = null; 
//         };
//       };
      

//     // Fetch the user's location using the IP address
//     // const fetchLocation = async (ip:any) => {
//     //   try {
//     //     const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=d987915b6c47432f83b96823b6086266&ip=103.251.19.182`, {
//     //       method: 'POST',
//     //       headers: {
//     //         'Content-Type': 'application/json',
//     //       },
//     //       body: JSON.stringify({
//     //         considerIp: true,
//     //       }),
//     //     });
//     //     const data = await response.json();
//     //     setLocation(data.location);
//     //   } catch (err) {
//     //     setError('Failed to fetch location');
//     //   }
//     // };

//     fetchIpUsingWebRTC();
//   }, []);


function getLocalIP(callback:any) {
    const pc = new RTCPeerConnection({
        // Using a public STUN server to gather ICE candidates
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.createDataChannel(""); // Create a dummy data channel

    pc.createOffer().then((offer) => pc.setLocalDescription(offer)).catch(err => console.error(err));

    // Listen for ICE candidates
    pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
            pc.close();
            return;
        }

        // Extract the IP address from the candidate
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/(?:\d{1,3}\.){3}\d{1,3}/);

        if (ipMatch) {
            const ipAddress = ipMatch[0];
            callback(ipAddress);
            pc.close();
        }
    };
}

// Usage in your component
getLocalIP((ip:any) => {
    setFreeIp(ip)
    console.log("Your Local IP Address:", ip);
});
//65416

  useEffect(() => {
    getLocalIP()
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
        // fetchLocation(data.ip);
      } catch (err) {
        setError('Failed to fetch IP address');
      }
    };

    // const fetchLocation = async (ip:any) => {
    //   try {
    //     const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=d987915b6c47432f83b96823b6086266&ip=103.251.19.182`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       }
    //     });

    //     console.log("response",response)
    //     const data = await response.json();
    //     setLocation(data.location);
    //   } catch (err) {
    //     setError('Failed to fetch location');
    //   }
    // };

    fetchIp();
  }, []);

  return (
    <div className="location-container">
      <h2>User Location Data</h2>
      {error && <p className="error">{error}</p>}
      {ip && <p><strong>IP Address:</strong> {ip}</p>}
      {<h1>Your Ip is:{freeIp}</h1>}
      {location ? (
        <div>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lng}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default LocationData;
