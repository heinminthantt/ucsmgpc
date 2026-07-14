import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import {
    Button, Badge,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Input, Separator,
} from '@/components/ui';
import { useDepartments, useAllCourses } from '@/hooks/useCatalog';
import type { Filters } from '@/types/catalog';

interface FilterModalProps {
    filters: Filters;
    onFilterChange: (field: keyof Filters, value: string | number) => void;
    onClearFilters: () => void;
}

export function FilterModal({ filters, onFilterChange, onClearFilters }: FilterModalProps) {
    const [open, setOpen] = useState(false);
    const { data: departments } = useDepartments();
    const { data: allCourses } = useAllCourses();

    const filteredCourses = useMemo(() => {
        if (!filters.departmentId || !allCourses) return [];
        return allCourses.filter((c) => c.department_id === parseInt(filters.departmentId));
    }, [filters.departmentId, allCourses]);

    const academicYears = useMemo(() => {
        const years = [];
        for (let y = 2020; y <= new Date().getFullYear() - 1; y++) {
            years.push(`${y}-${y + 1}`);
        }
        return years.reverse();
    }, []);

    const semesters = [
        'Semester I','Semester II','Semester III','Semester IV',
        'Semester V','Semester VI','Semester VII','Semester VIII',
        'Semester IX','Internship','Final Project',
    ];

    const activeCount = Object.entries(filters).filter(
        ([k, v]) => !['page','size','sortBy','sortDirection'].includes(k) && v !== '',
    ).length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                    <Icon icon="mdi:filter-variant" className="text-base" />
                    Filters
                    {activeCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon icon="mdi:filter-variant" className="text-primary" />
                        Filter Projects
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-5">
                    {/* Keyword */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium flex items-center gap-1.5">
                            <Icon icon="mdi:magnify" className="text-muted-foreground" />
                            Keyword
                        </label>
                        <Input
                            placeholder="Title, description, content..."
                            value={filters.keyword}
                            onChange={(e) => onFilterChange('keyword', e.target.value)}
                        />
                    </div>

                    <Separator />

                    {/* Department & Course */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:office-building-outline" className="text-muted-foreground" />
                                Department
                            </label>
                            <Select
                                value={filters.departmentId || 'all'}
                                onValueChange={(v) => {
                                    onFilterChange('departmentId', v === 'all' ? '' : v);
                                    onFilterChange('courseId', '');
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All departments</SelectItem>
                                    {departments?.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:book-open-variant" className="text-muted-foreground" />
                                Course
                            </label>
                            <Select
                                value={filters.courseId || 'all'}
                                onValueChange={(v) => onFilterChange('courseId', v === 'all' ? '' : v)}
                                disabled={!filters.departmentId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All courses</SelectItem>
                                    {filteredCourses.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.code ? `${c.code} — ` : ''}{c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Year & Semester */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:calendar-outline" className="text-muted-foreground" />
                                Academic Year
                            </label>
                            <Select
                                value={filters.academicYear || 'all'}
                                onValueChange={(v) => onFilterChange('academicYear', v === 'all' ? '' : v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All years" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All years</SelectItem>
                                    {academicYears.map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:school-outline" className="text-muted-foreground" />
                                Semester
                            </label>
                            <Select
                                value={filters.studentYear || 'all'}
                                onValueChange={(v) => onFilterChange('studentYear', v === 'all' ? '' : v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All semesters</SelectItem>
                                    {semesters.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {/* Supervisor, Team, Tags */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:account-tie-outline" className="text-muted-foreground" />
                                Supervisor
                            </label>
                            <Input placeholder="e.g. Dr. Smith" value={filters.supervisor} onChange={(e) => onFilterChange('supervisor', e.target.value)} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:account-group-outline" className="text-muted-foreground" />
                                Team Member
                            </label>
                            <Input placeholder="e.g. John Doe" value={filters.members} onChange={(e) => onFilterChange('members', e.target.value)} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Icon icon="mdi:tag-multiple-outline" className="text-muted-foreground" />
                                Language / Technology
                            </label>
                            <Input placeholder="e.g. React, Python, Laravel" value={filters.tags} onChange={(e) => onFilterChange('tags', e.target.value)} />
                        </div>
                    </div>

                    {/* Active filters display */}
                    {activeCount > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {Object.entries(filters)
                                .filter(([k, v]) => !['page','size','sortBy','sortDirection'].includes(k) && v !== '')
                                .map(([k, v]) => (
                                    <Badge key={k} variant="secondary" className="gap-1 text-xs">
                                        {String(v)}
                                        <button
                                            onClick={() => onFilterChange(k as keyof Filters, '')}
                                            className="ml-1 hover:text-destructive"
                                        >×</button>
                                    </Badge>
                                ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        {activeCount > 0 && (
                            <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-1.5">
                                <Icon icon="mdi:refresh" />
                                Clear all
                            </Button>
                        )}
                        <Button size="sm" className="ml-auto gap-1.5" onClick={() => setOpen(false)}>
                            <Icon icon="mdi:check" />
                            Apply ({activeCount} filter{activeCount !== 1 ? 's' : ''})
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
