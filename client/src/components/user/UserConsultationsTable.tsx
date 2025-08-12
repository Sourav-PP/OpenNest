import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from './CustomPagination';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IConsultationDto } from '@/types/consultation';
import { userApi } from '@/server/api/user';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const UserConsultationsTable = () => {
    const [consultations, setConsultations] = useState<IConsultationDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');
    const [status, setStatus] = useState<'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all'>('all');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const itemsPerPage = 10;

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                setLoading(true)
                const data = await userApi.getUserConsultations({
                    search: debouncedSearch,
                    sort: sort,
                    status: status,
                    limit: itemsPerPage,
                    page: currentPage,
                });

                console.log('data: ', data);
                setConsultations(data.consultations);
                setTotalCount(data.totalCount ?? 0);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false)
            }
        };

        fetchConsultations();
    }, [currentPage, debouncedSearch, sort, status]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: "1.2s" }}>
        {[...Array(8)].map((_, index) => (
            <div
            key={index}
            className="absolute h-2 w-2 bg-gray-300 rounded-full"
            style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
            }}
            ></div>
        ))}
        <span className="sr-only">Loading...</span>
        </div>
    </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#e9f1f4] to-[#f3feff] min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Consultations</h2>
        <div className="space-y-6 dark:bg-gray-800 rounded-lg">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <Input
                    placeholder="Search by session goal or psychologist"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full sm:w-80 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    aria-label="Search consultations"
                />

                <Select
                    value={sort}
                    onValueChange={(value) => {
                        setSort(value as "asc" | "desc");
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger
                        className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        aria-label="Sort consultations by date"
                    >
                        <SelectValue placeholder="Sort by date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Start Date Asc</SelectItem>
                        <SelectItem value="desc">Start Date Desc</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={status}
                    onValueChange={(value) => {
                        setStatus(value as 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all');
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger
                        className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        aria-label="Filter consultations by status"
                    >
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="cancelled">Canceled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primaryText">
                            <TableHead className="font-semibold text-white ps-4">SI</TableHead>
                            <TableHead className="font-semibold text-white">Psychologist</TableHead>
                            <TableHead className="font-semibold text-white">Start Date & Time</TableHead>
                            <TableHead className="font-semibold text-white">End Date & Time</TableHead>
                            <TableHead className="font-semibold text-white">Status</TableHead>
                            <TableHead className="font-semibold text-white">Meeting Link</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consultations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No consultations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            consultations.map((c, index) => (
                                <TableRow
                                    key={c.id}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                                    }`}
                                >
                                    <TableCell className="text-gray-800 ps-4">{index + 1}</TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">{c.psychologist.name}</TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">
                                        {new Date(c.startDateTime).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">
                                        {new Date(c.endDateTime).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                c.status === 'booked'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : c.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : c.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}
                                        >
                                            {c.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {c.meetingLink ? (
                                            <a
                                                href={c.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                aria-label={`Join meeting for consultation ${c.id}`}
                                            >
                                                Join
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">N/A</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
        </div>
    );
};

export default UserConsultationsTable;