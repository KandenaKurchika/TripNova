import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import TripPreferencesForm from '../components/TripPreferencesForm.jsx';
import ItineraryTimeline from '../components/ItineraryTimeline.jsx';
import WeatherSafetyCard from '../components/WeatherSafetyCard.jsx';
import MapView from '../components/MapView.jsx';
import api from '../api/axiosClient.js';

export default function ChatPlanner() {
  const { tripId } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [trip, setTrip] = useState(null);
  const [structured, setStructured] = useState(null); // { itinerary, costEstimate } from Claude
  const [forecast, setForecast] = useState([]);
  const [safetyNotes, setSafetyNotes] = useState([]);

  useEffect(() => {
    if (!tripId) return;
    api.get(`/trips/${tripId}`).then(({ data }) => {
      setTrip(data.trip);
      if (data.trip.itinerary) {
        setStructured({
          itinerary: data.trip.itinerary.days?.map((d) => ({ day: d.dayNumber, theme: d.theme, activities: d.activities })),
          costEstimate: data.trip.estimatedCost,
        });
        setForecast(data.trip.itinerary.weatherSnapshot || []);
        setSafetyNotes(data.trip.itinerary.safetyNotes || []);
      }
    });
  }, [tripId]);

  const createTripAndGenerate = async (form) => {
    const { data: created } = await api.post('/trips', {
      title: `Trip to ${form.destination}`,
      destinationName: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      travelers: form.travelers,
      budgetTier: form.budgetTier,
      interests: form.interests,
    });
    setTrip(created.trip);

    const { data: gen } = await api.post(`/trips/${created.trip._id}/generate-itinerary`);
    setTrip(gen.trip);
    setStructured({
      itinerary: gen.itinerary.days.map((d) => ({ day: d.dayNumber, theme: d.theme, activities: d.activities })),
      costEstimate: gen.trip.estimatedCost,
    });
    setForecast(gen.itinerary.weatherSnapshot || []);
    setSafetyNotes(gen.itinerary.safetyNotes || []);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 grid lg:grid-cols-[1fr_380px] gap-6 p-6 overflow-hidden">
          <section className="bg-card/30 rounded-2xl p-5 flex flex-col overflow-hidden">
            <ChatWindow
              sessionId={sessionId}
              setSessionId={setSessionId}
              tripContext={trip ? { destination: trip.destination, budgetTier: trip.budgetTier, travelers: trip.travelers } : null}
              onStructured={setStructured}
            />
          </section>

          <aside className="space-y-5 overflow-y-auto pr-1">
            {!trip && <TripPreferencesForm onSubmit={createTripAndGenerate} />}
            {trip && <MapView lat={trip.destination?.lat} lng={trip.destination?.lng} />}
            {structured?.itinerary?.length ? (
              <div className="bg-card/40 rounded-2xl p-5">
                <ItineraryTimeline days={structured.itinerary} />
              </div>
            ) : null}
            <WeatherSafetyCard forecast={forecast} safetyNotes={safetyNotes} costEstimate={structured?.costEstimate} />
          </aside>
        </main>
      </div>
    </div>
  );
}
