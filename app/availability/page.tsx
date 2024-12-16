'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import { getIntervenantByKey, saveAvailability } from '@/lib/data';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Intervenant } from '@/types';

export default function Availability() {
    const [intervenant, setIntervenant] = useState<Intervenant>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedSlot, setSelectedSlot] = useState(null); 
    const [slotToDelete, setSlotToDelete] = useState(null); 
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [editingEvent, setEditingEvent] = useState(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const searchParams = useSearchParams();
    const calendarRef = useRef(null);

    useEffect(() => {
        const fetchIntervenant = async () => {
            const key = searchParams.get('key');
            if (key) {
                const intervenant = await getIntervenantByKey(key);
                setIntervenant(intervenant);
                setEvents(transformSlotsToEvents(intervenant, new Date()));
            }
            setIsLoading(false);
        };
        fetchIntervenant();
    }, [searchParams]);

    useEffect(() => {
        if (intervenant) {
            const newMessages = calculateMessages();
            setMessages(newMessages);
        }
    }, [intervenant]);

    const handleSelect = (selectionInfo: any) => {
        const { start, end } = selectionInfo;
        setSelectedSlot({ start, end });
    };

    const saveSlot = () => {
        if (!selectedSlot) return;
        const { start, end } = selectedSlot;
        if (start >= end) {
            alert("L'heure de début doit être avant l'heure de fin.");
            return;
        }

        if (!intervenant.workweek || !intervenant.workweek.data) {
            alert("Les données de la semaine de travail ne sont pas disponibles.");
            return;
        }

        const selectedWeek = getWeekNumber(start);
        const isWithinWorkweek = intervenant.workweek.data.some(week => week.week === selectedWeek);
        if (intervenant.workweek.data.length > 0 && !isWithinWorkweek) {
            alert("Le créneau doit être compris dans les semaines de votre contrat.");
            return;
        }

        const weekNumber = getWeekNumber(start);
        const weekKey = `S${weekNumber}`;
        const newSlot = {
            days: getDayFromDate(start),
            from: formatTime(start),
            to: formatTime(end),
        };
        const updatedAvailability = {
            ...intervenant.availability,
            [weekKey]: [
                ...(intervenant.availability[weekKey] || []),
                newSlot,
            ],
        };
        const updatedIntervenant = {
            ...intervenant,
            availability: updatedAvailability,
        };
        setIntervenant(updatedIntervenant);
        setEvents(transformSlotsToEvents(updatedIntervenant, currentWeek));
        saveAvailability(updatedIntervenant);
        setSelectedSlot(null);     
    };

    const deleteSlot = () => {
        if (!slotToDelete) return;
        const { slot, isDefault } = slotToDelete;
        if (isDefault) {
            alert("Les créneaux par défaut ne peuvent pas être supprimés.");
            return;
        }
        const weekNumber = getWeekNumber(currentWeek);
        const weekKey = `S${weekNumber}`;
        const updatedWeekSlots = intervenant.availability[weekKey].filter(
            (s: {}) => !(s.from === slot.from && s.to === slot.to && s.days === slot.days)
        );
        const updatedAvailability = {
            ...intervenant.availability,
            [weekKey]: updatedWeekSlots,
        };

        // Remove the week key if there are no more slots in the week
        if (updatedWeekSlots.length === 0) {
            delete updatedAvailability[weekKey];
        }

        const updatedIntervenant = {
            ...intervenant,
            availability: updatedAvailability,
        };
        setIntervenant(updatedIntervenant);
        setEvents(transformSlotsToEvents(updatedIntervenant, currentWeek));
        saveAvailability(updatedIntervenant);
        setSlotToDelete(null);
        setSelectedEvent(null);     
    };    

    const calculateMessages = () => {
        if (!intervenant || !intervenant.workweek || !intervenant.workweek.data) return [];
    
        const underfilledWeeks = intervenant.workweek.data.map(({ week, hours }) => {
            const weekKey = `S${week}`;
            const slots = intervenant.availability[weekKey] || [];
            const defaultSlots = intervenant.availability.default || [];
    
            // Calcule les heures totales pour la semaine
            let totalHours = 0;
            if (slots.length === 0 && defaultSlots.length > 0) {
                totalHours = defaultSlots.reduce((sum, slot) => {
                    const [startHour, startMinute] = slot.from.split(':').map(Number);
                    const [endHour, endMinute] = slot.to.split(':').map(Number);
                    const duration = (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
                    return sum + duration;
                }, 0);
            } else {
                totalHours = slots.reduce((sum, slot) => {
                    const [startHour, startMinute] = slot.from.split(':').map(Number);
                    const [endHour, endMinute] = slot.to.split(':').map(Number);
                    const duration = (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
                    return sum + duration;
                }, 0);
            }
    
            return {
                week,
                expected: hours,
                provided: totalHours,
                missing: hours - totalHours > 0 ? hours - totalHours : 0, // Heures manquantes
            };
        });
    
        return underfilledWeeks;
    };
    

    const editSlot = () => {
        if (!editingEvent) return;
        const { slot, updatedStart, updatedEnd } = editingEvent;

        if (updatedStart >= updatedEnd) {
            alert("L'heure de début doit être avant l'heure de fin.");
            return;
        }

        const weekNumber = getWeekNumber(currentWeek);
        const weekKey = `S${weekNumber}`;
        const updatedAvailability = {
            ...intervenant.availability,
            [weekKey]: intervenant.availability[weekKey].map((s: {}) =>
                s.from === slot.from && s.to === slot.to && s.days === slot.days
                    ? { ...slot, from: formatTime(updatedStart), to: formatTime(updatedEnd) }
                    : s
            ),
        };

        const updatedIntervenant = {
            ...intervenant,
            availability: updatedAvailability,
        };

        setIntervenant(updatedIntervenant);
        setEvents(transformSlotsToEvents(updatedIntervenant, currentWeek));
        saveAvailability(updatedIntervenant);
        setEditingEvent(null);
        setSelectedEvent(null);     
    };

    const getDayFromDate = (date: Date) => {
        const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
        return days[date.getDay()];
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const handleDatesSet = ({ start }) => {
        const startDate = new Date(start);
        const newYear = getThursdayYear(startDate);
        if (currentWeek.getTime() !== startDate.getTime() || currentYear !== newYear) {
            setCurrentWeek(startDate);
            setCurrentYear(newYear);
        }
        if (intervenant) {
            const allEvents = transformSlotsToEvents(intervenant, startDate);
            if (JSON.stringify(events) !== JSON.stringify(allEvents)) {
                setEvents(allEvents);
            }
        }
    };

    const transformSlotsToEvents = (intervenant, currentDate) => {
        const events = [];
        const currentWeekNumber = getWeekNumber(currentDate);
        const slots = intervenant.availability;
    
        // Vérifiez si les semaines de travail sont définies
        if (!intervenant.workweek || !intervenant.workweek.data) {
            return events; // Si aucune semaine de travail n'est définie, retourner un tableau vide
        }
    
        // Obtenez les semaines de travail
        const workweeks = intervenant.workweek.data.map(week => week.week);
    
        // Afficher uniquement si la semaine actuelle est une semaine de travail
        if (workweeks.includes(currentWeekNumber)) {
            Object.keys(slots).forEach((key) => {
                // Afficher les créneaux spécifiques pour la semaine ou utiliser les créneaux par défaut si non définis
                if (key === `S${currentWeekNumber}` || (key === "default" && !slots[`S${currentWeekNumber}`])) {
                    slots[key].forEach((slot) => {
                        slot.days.split(", ").forEach((day) => {
                            events.push({
                                title: key === "default" ? "Créneau par défaut" : "Créneau personnalisé",
                                startTime: slot.from,
                                endTime: slot.to,
                                daysOfWeek: [convertDayToNumber(day)],
                                backgroundColor: key === "default" ? "#FFCDD2" : "#FF0000",
                                textColor: "#FFFFFF",
                                borderColor: "transparent",
                                extendedProps: {
                                    slot,
                                    isDefault: key === "default",
                                },
                            });
                        });
                    });
                }
            });
        }
    
        return events;
    };

    const getWeekNumber = (date) => {
        const target = new Date(date);
        const dayNr = (target.getDay() + 6) % 7; // Lundi = 0
        target.setDate(target.getDate() - dayNr + 3); // Aller au jeudi
        const firstThursday = new Date(target.getFullYear(), 0, 4); // Premier jeudi
        const diff = target - firstThursday;
        return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000)); // Numéro de semaine
    };

    const convertDayToNumber = (day) => {
        const days = { lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5 };
        return days[day];
    };

    const getThursdayYear = (date) => {
        const thursday = new Date(date);
        thursday.setDate(date.getDate() + (4 - date.getDay() + 7) % 7); // Trouver le jeudi
        return thursday.getFullYear();
    };

    const has53rdWeek = (year) => {
        const lastDay = new Date(year, 11, 31); // 31 décembre
        const lastDayOfWeek = lastDay.getDay();
        return lastDayOfWeek === 4 || (new Date(year + 1, 0, 1).getDay() === 5); // Jeudi ou vendredi
    };

    const navigateToWeek = (weekNumber) => {
        const firstThursday = new Date(currentYear, 0, 4);
        const firstWeekMonday = new Date(firstThursday);
        firstWeekMonday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7)); // Premier lundi
        const targetDate = new Date(firstWeekMonday);
        targetDate.setDate(firstWeekMonday.getDate() + (weekNumber - 1) * 7);

        setCurrentWeek(targetDate);
        calendarRef.current.getApi().changeView('timeGridWeek', targetDate);
    };

    const changeYear = (year) => {
        setCurrentYear(year);
        const firstDayOfYear = new Date(year, 0, 1);
        const firstThursday = new Date(firstDayOfYear);
        firstThursday.setDate(firstDayOfYear.getDate() + ((4 - firstDayOfYear.getDay() + 7) % 7)); // Premier jeudi
        const firstWeekMonday = new Date(firstThursday);
        firstWeekMonday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7)); // Premier lundi ISO
        setCurrentWeek(firstWeekMonday);
        calendarRef.current.getApi().changeView('timeGridWeek', firstWeekMonday);
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!intervenant) {
        return notFound();
    }

    console.log(messages)

    return (
    <div className="mx-auto h-fit p-6 bg-gray-50">
        <div className='flex flex-row w-full gap-4 items-center mb-8 justify-center'>
            <h1 className="text-center text-3xl font-bold text-gray-700">
                Planning de l'intervenant {intervenant.firstname} {intervenant.lastname}
            </h1>
            {/* Bouton pour ouvrir la popup des messages */}
            <button
                className="flex items-center justify-center p-2 bg-gray-500 size-8 text-white rounded-full hover:bg-gray-600 focus:outline-none"
                onClick={() => setIsPopupOpen(true)}
            >
                ?
            </button>
        </div>
        <div className="flex gap-6 h-fit">
            {/* Sidebar - Week Selector */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow border border-gray-200 h-full">
                <h2 className="text-lg font-semibold mb-4 text-gray-600">Semaine</h2>
                <select
                    value={currentYear}
                    onChange={(e) => changeYear(parseInt(e.target.value))}
                    className="mb-4 p-2 border border-gray-300 rounded"
                >
                    {[...Array(5)].map((_, i) => (
                        <option key={i} value={currentYear - 2 + i}>
                            {currentYear - 2 + i}
                        </option>
                    ))}
                </select>
                <div className="grid grid-cols-4 gap-2">
                    {[...Array(has53rdWeek(currentYear) ? 53 : 52).keys()].map((week) => (
                        <button
                            key={week + 1}
                            className={`p-2 rounded-lg text-center font-semibold ${
                                getWeekNumber(currentWeek) === week + 1
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-red-200"
                            }`}
                            onClick={() => navigateToWeek(week + 1)}
                        >
                            {week + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar */}
            <div className="w-3/4 bg-white p-4 rounded-lg shadow border border-gray-200">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    selectable={true}
                    hiddenDays={[0, 6]}
                    events={events}
                    headerToolbar={{
                        left: "prev,next today",
                        right: "title",
                    }}
                    buttonText={{
                        today: "Aujourd'hui",
                        week: "Semaine",
                    }}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    select={handleSelect}
                    height='100%'
                    allDaySlot={false}
                    datesSet={handleDatesSet}
                    eventClick={(info) => setSelectedEvent(info.event)}/>
            </div>
        </div>

        {/* Default Availability Management */}
        <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Modifier les disponibilités par défaut</h2>
            {intervenant.availability.default.map((slot, index) => (
                <div
                    key={index}
                    className="flex flex-wrap items-end gap-6 border-b pb-4 last:border-b-0"
                >
                    <div className="flex flex-col flex-1">
                        <label className="block text-sm font-medium text-gray-600">Jours</label>
                        <select
                            multiple
                            value={slot.days.split(", ")}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(
                                    (option) => option.value
                                );
                                const updatedDefault = [...intervenant.availability.default];
                                updatedDefault[index] = { ...slot, days: selectedOptions.join(", ") };
                                setIntervenant({
                                    ...intervenant,
                                    availability: { ...intervenant.availability, default: updatedDefault },
                                });
                            }}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="lundi">Lundi</option>
                            <option value="mardi">Mardi</option>
                            <option value="mercredi">Mercredi</option>
                            <option value="jeudi">Jeudi</option>
                            <option value="vendredi">Vendredi</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="block text-sm font-medium text-gray-600">Début</label>
                        <input
                            type="time"
                            value={slot.from}
                            onChange={(e) => {
                                const updatedDefault = [...intervenant.availability.default];
                                updatedDefault[index] = { ...slot, from: e.target.value };
                                setIntervenant({
                                    ...intervenant,
                                    availability: { ...intervenant.availability, default: updatedDefault },
                                });
                            }}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="block text-sm font-medium text-gray-600">Fin</label>
                        <input
                            type="time"
                            value={slot.to}
                            onChange={(e) => {
                                const updatedDefault = [...intervenant.availability.default];
                                updatedDefault[index] = { ...slot, to: e.target.value };
                                setIntervenant({
                                    ...intervenant,
                                    availability: { ...intervenant.availability, default: updatedDefault },
                                });
                            }}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => {
                            const updatedDefault = intervenant.availability.default.filter(
                                (_, i) => i !== index
                            );
                            setIntervenant({
                                ...intervenant,
                                availability: { ...intervenant.availability, default: updatedDefault },
                            });
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Supprimer
                    </button>
                </div>
            ))}
            <div className="flex justify-end gap-6 items-center mt-4">
                <button
                    onClick={() => {
                        const updatedDefault = [
                            ...intervenant.availability.default,
                            { days: "lundi", from: "08:00", to: "12:00" },
                        ];
                        setIntervenant({
                            ...intervenant,
                            availability: { ...intervenant.availability, default: updatedDefault },
                        });
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Ajouter un créneau par défaut
                </button>
                <button
                    onClick={() => saveAvailability(intervenant)}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Enregistrer les modifications
                </button>
            </div>
        </div>

        {/* Popup des messages */}
        {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Bilan des Heures</h2>
                    <div className="space-y-2">
                        <ul className="list-disc list-inside">
                            {messages.map((message, index) => (
                                <li key={index} className="text-gray-700">
                                    <strong>Semaine {message.week}</strong> : 
                                    {` ${message.provided} / ${message.expected} heures `}
                                    {message.missing > 0 ? (
                                        <span className="text-red-500">(-{message.missing} heures manquantes)</span>
                                    ) : (
                                        <span className="text-green-500">(Complet)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Event Details */}
        {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Détails du créneau</h2>
                        <div className="mb-4">
                            <p>
                                <strong>Début:</strong>{" "}
                                {selectedEvent.start.toLocaleString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            <p>
                                <strong>Fin:</strong>{" "}
                                {selectedEvent.end.toLocaleString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            {selectedEvent.extendedProps.isDefault && (
                                <p className="text-sm text-gray-600">Créneau par défaut</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                            >
                                Fermer
                            </button>
                            {!selectedEvent.extendedProps.isDefault && (
                                <>
                                    <button
                                        onClick={() =>
                                            setSlotToDelete({
                                                slot: selectedEvent.extendedProps.slot,
                                                isDefault: selectedEvent.extendedProps.isDefault,
                                            })
                                        }
                                        className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Supprimer
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingEvent({
                                                slot: selectedEvent.extendedProps.slot,
                                                updatedStart: new Date(selectedEvent.start),
                                                updatedEnd: new Date(selectedEvent.end),
                                            });
                                            setSelectedEvent(null);
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Modifier
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modale pour éditer un événement */}
            {editingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Modifier le créneau</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Début</label>
                            <input
                                type="time"
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                value={formatTime(editingEvent.updatedStart)}
                                onChange={(e) =>
                                    setEditingEvent({
                                        ...editingEvent,
                                        updatedStart: new Date(
                                            `${editingEvent.updatedStart.toISOString().split("T")[0]}T${e.target.value}`
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fin</label>
                            <input
                                type="time"
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                value={formatTime(editingEvent.updatedEnd)}
                                onChange={(e) =>
                                    setEditingEvent({
                                        ...editingEvent,
                                        updatedEnd: new Date(
                                            `${editingEvent.updatedEnd.toISOString().split("T")[0]}T${e.target.value}`
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={editSlot}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modale de confirmation */}
            {selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Confirmer le créneau</h2>
                        <p className="text-sm mb-4 text-gray-600">
                            Les créneaux personnalisés sont uniquement valables pour cette semaine.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Début</label>
                            <input
                                type="time"
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                value={formatTime(selectedSlot.start)}
                                onChange={(e) =>
                                    setSelectedSlot({
                                        ...selectedSlot,
                                        start: new Date(
                                            `${selectedSlot.start.toISOString().split("T")[0]}T${e.target.value}`
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fin</label>
                            <input
                                type="time"
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                value={formatTime(selectedSlot.end)}
                                onChange={(e) =>
                                    setSelectedSlot({
                                        ...selectedSlot,
                                        end: new Date(
                                            `${selectedSlot.end.toISOString().split("T")[0]}T${e.target.value}`
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={saveSlot}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modale de suppression */}
            {slotToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Supprimer le créneau</h2>
                        <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce créneau ?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setSlotToDelete(null);
                                    setSelectedEvent(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={deleteSlot}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
);

}