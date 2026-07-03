'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { FileDown, Link2, Save } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatCurrency } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  ESTIMATE_BUILDINGS,
  ESTIMATE_PACKAGES,
} from '../constants/estimate.constants';
import { calcEstimate } from '../services/estimate.service';
import type { EstimateInput } from '../types/estimate.types';

const INITIAL: EstimateInput = {
  area: 100,
  floors: 1,
  rooms: 2,
  building: 'apartment',
  packageId: 'standard',
};

/** Standalone cost estimator (Q&A §5.1): inputs → live breakdown. */
export function EstimateCreator() {
  const t = useTranslations('estimate.creator');
  const locale = useLocale() as Locale;
  const [input, setInput] = useState<EstimateInput>(INITIAL);

  const result = useMemo(() => calcEstimate(input), [input]);
  const money = (v: number) => formatCurrency(v, locale);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('inputsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">{t('areaLabel')}</Label>
              <Input
                id="area"
                type="number"
                min={0}
                value={input.area || ''}
                onChange={(e) =>
                  setInput((s) => ({ ...s, area: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">{t('floorsLabel')}</Label>
              <Input
                id="floors"
                type="number"
                min={1}
                max={3}
                value={input.floors || ''}
                onChange={(e) =>
                  setInput((s) => ({ ...s, floors: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">{t('roomsLabel')}</Label>
              <Input
                id="rooms"
                type="number"
                min={0}
                value={input.rooms || ''}
                onChange={(e) =>
                  setInput((s) => ({ ...s, rooms: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t('buildingLabel')}</Label>
              <Select
                value={input.building}
                onValueChange={(v) =>
                  setInput((s) => ({
                    ...s,
                    building: v as EstimateInput['building'],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTIMATE_BUILDINGS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {t(`building.${b}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('packageLabel')}</Label>
            <RadioGroup
              value={input.packageId}
              onValueChange={(v) =>
                setInput((s) => ({
                  ...s,
                  packageId: v as EstimateInput['packageId'],
                }))
              }
              className="gap-2"
            >
              {ESTIMATE_PACKAGES.map((p) => (
                <label
                  key={p.id}
                  className="hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value={p.id} />
                    <span className="text-sm font-medium">
                      {t(`package.${p.id}`)}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {money(p.finishingPerSqm + p.interiorPerSqm)}/m²
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('resultTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.portion')}</TableHead>
                  <TableHead className="text-right">
                    {t('columns.quantity')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('columns.unitPrice')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('columns.amount')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.lines.map((line) => (
                  <TableRow key={line.portion}>
                    <TableCell className="font-medium">
                      {t(`portion.${line.portion}`)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {line.quantity} {line.unit}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {money(line.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {money(line.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-semibold">
                    {t('total')}
                  </TableCell>
                  <TableCell className="text-primary text-right text-base font-bold tabular-nums">
                    {money(result.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success(t('saved'))}>
              <Save className="size-4" />
              {t('save')}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success(t('exported'))}
            >
              <FileDown className="size-4" />
              {t('exportPdf')}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success(t('shared'))}
            >
              <Link2 className="size-4" />
              {t('share')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
