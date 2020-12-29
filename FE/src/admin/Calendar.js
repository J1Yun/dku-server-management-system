import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useQuery } from 'react-apollo';
import SnackMessage from './components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { GET_CALENDAR_RESERVATIONS } from '../queries';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export default function ServerCalendar() {
    const [events, setEvents] = useState([]);

    const { loading, error, data } = useQuery(GET_CALENDAR_RESERVATIONS);

    useEffect(() => {
        if (data) {
            setEvents(
                data.getCalendarReservations.map((d) => {
                    return {
                        id: d.id,
                        start: d.start,
                        end: d.end,
                        title: `ID ${d.serverId} / ${d.department} ${d.name} / ${
                            parseInt(d.returnOk) === 0 ? '반납 X' : '반납 O'
                        }`,
                        allDay: true,
                    };
                }),
            );
        }
    }, [data, setEvents]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            <PageTitle title="캘린더" />
            <div style={{ height: 700 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </>
    );
}
