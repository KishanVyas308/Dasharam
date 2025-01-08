import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

// Event collection
// [
//     {
//         name: "event1",
//         date: "2022-01-01",
//         detail: "Event details"
//     }
// ]

// TODO: add event
export async function addEvent(name: string, date: string, detail: string) {
    const event = {
        name,
        date,
        detail
    };
    try {
        const eventRef = await addDoc(collection(db, "events"), event);
        return { id: eventRef.id, ...event };
    } catch (error) {
        console.log("Error adding event", error);
        return null;
    }
}

// TODO: get all events
export async function getEvents() {
    const q = query(collection(db, "events"));
    try {
        const allEvents = await getDocs(q);
        const result: any[] = [];
        allEvents.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        return result;
    } catch (error) {
        console.log("Error getting all events", error);
        return null;
    }
}

export async function deleteEvent(id: string) {
    const eventRef = doc(db, "events", id);
    try {
        await deleteDoc(eventRef);
        return { id, message: "Event deleted successfully" };
    } catch (error) {
        console.log("Error deleting event", error);
        return null;
    }
}

//! Express endpoint handlers
export async function addEventEndpoint(req: any, res: any) {
    const { name, date, detail } = req.body;
    try {
        const event = await addEvent(name, date, detail);
        res.status(200).send({ message: 'Event added successfully', event });
    } catch (error) {
        res.status(500).send({ message: 'Error adding event', error });
    }
}

export async function getEventsEndpoint(req: any, res: any) {
    try {
        const events = await getEvents();
        res.status(200).send(events);
    } catch (error) {
        res.status(500).send({ message: 'Error getting all events', error });
    }
}

export async function deleteEventEndpoint(req: any, res: any) {
    try {
        const id = req.params.id;
        console.log(id);
        await deleteEvent(id);
        res.status(200).send({ message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).send({ message: 'Error deleting event', error });
    }
}
