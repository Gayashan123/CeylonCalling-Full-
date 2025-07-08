import React, { useState } from 'react';
import BottomNav from "../components/BottomNav"

function Addplace() {
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [comment, setComment] = useState('');

  const addLocation = () => {
    if (!locationName || !locationAddress) return;
    const newLocation = {
      id: Date.now(),
      name: locationName,
      address: locationAddress,
      comments: comment ? [{ id: Date.now(), text: comment }] : []
    };
    setLocations([...locations, newLocation]);
    setLocationName('');
    setLocationAddress('');
    setComment('');
  };

  const addComment = (locationId) => {
    const newCommentText = prompt('Enter your comment:');
    if (!newCommentText) return;
    setLocations(locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          comments: [...loc.comments, { id: Date.now(), text: newCommentText }]
        };
      }
      return loc;
    }));
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Add a Location</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Location Name"
          value={locationName}
          onChange={e => setLocationName(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Location Address"
          value={locationAddress}
          onChange={e => setLocationAddress(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          onClick={addLocation}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 4,
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Add Location
        </button>
      </div>

      <div>
        {locations.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No locations added yet.</p>
        ) : (
          locations.map(loc => (
            <div key={loc.id} style={{ marginBottom: 20, padding: 15, border: '1px solid #ddd', borderRadius: 6 }}>
              <h3 style={{ margin: 0, color: '#007BFF' }}>{loc.name}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}>{loc.address}</p>
              <div style={{ marginTop: 10 }}>
                <strong>Comments:</strong>
                {loc.comments.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: '#999' }}>No comments yet.</p>
                ) : (
                  <ul style={{ paddingLeft: 20 }}>
                    {loc.comments.map(c => (
                      <li key={c.id} style={{ color: '#333' }}>{c.text}</li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => addComment(loc.id)}
                  style={{
                    marginTop: 10,
                    padding: '5px 10px',
                    fontSize: 14,
                    borderRadius: 4,
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
<BottomNav />


    </div>
  );
}

export default Addplace;
