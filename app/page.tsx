"use client";

import { fetchIntervenants } from "@/lib/data";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function getIntervenants() {
      const fetchedIntervenants = await fetchIntervenants();
      const allEvents = fetchedIntervenants.flatMap((intervenant: any) => {
        return transformSlotsToEvents(intervenant.name, intervenant.slots, new Date());
      });
      setEvents(allEvents);
    }
    getIntervenants();
  }, []);

  function handleDatesSet(dateInfo: any) {
    async function getIntervenants() {
      const fetchedIntervenants = await fetchIntervenants();
      const allEvents = fetchedIntervenants.flatMap((intervenant: any) => {
        return transformSlotsToEvents(intervenant.name, intervenant.slots, dateInfo.start);
      });
      setEvents(allEvents);
    }
    getIntervenants();
  }

  function transformSlotsToEvents(intervenantName: string, slots: any, currentDate: Date) {
    const events: any[] = [];
    const currentWeekNumber = getWeekNumber(currentDate);

    // Pour chaque clé (default, S38, S40, etc.) dans slots
    Object.keys(slots).forEach((key) => {
      // Si la semaine courante correspond à une clé (S<number>), on l'utilise à la place de "default"
      if (key !== "default" && key === `S${currentWeekNumber}`) {
        slots[key].forEach((slot: any) => {
          const days = slot.days.split(", ");
          days.forEach((day: string) => {
            events.push({
              title: intervenantName,
              startTime: slot.from,
              endTime: slot.to,
              daysOfWeek: [convertDayToNumber(day)],
            });
          });
        });
      } else if (key === "default" && !Object.keys(slots).some(k => k === `S${currentWeekNumber}`)) {
        // Utiliser "default" uniquement si aucune clé spécifique pour la semaine courante n'existe
        slots[key].forEach((slot: any) => {
          const days = slot.days.split(", ");
          days.forEach((day: string) => {
            events.push({
              title: intervenantName,
              startTime: slot.from,
              endTime: slot.to,
              daysOfWeek: [convertDayToNumber(day)],
            });
          });
        });
      }
    });

    return events;
  }

  function convertDayToNumber(day: string) {
    const days: { [key: string]: number } = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 0,
    };
    return days[day];
  }

  function getWeekNumber(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md flex justify-center items-center min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">Planning des Intervenants</h1>
      <FullCalendar
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            window.open(info.event.url, '_blank');
          }
        }}
        initialView="timeGridWeek"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
        }}
        eventColor="#2563eb"
        eventTextColor="#ffffff"
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        timeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        className="bg-white rounded-lg shadow-lg"
        datesSet={handleDatesSet}
      />
    </div>
  );
}
