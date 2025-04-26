// src/app/core/models/statistics.ts

export interface OccupancyData {
    period: string[];
    rates: number[];
    avgRate: number;
  }
  
  export interface RevenueData {
    period: string[];
    amounts: number[];
    totalAmount: number;
    comparisonWithPrevious: number; // pourcentage
  }
  
  export interface PopularityData {
    spaceTypes: string[];
    reservationCounts: number[];
    mostPopular: {
      type: string;
      count: number;
    };
  }
  
  export interface OriginData {
    countries: string[];
    counts: number[];
    topCountry: {
      name: string;
      count: number;
      percentage: number;
    };
  }
  
  export interface DashboardStats {
    totalReservations: number;
    pendingReservations: number;
    totalClients: number;
    newClientsThisMonth: number;
    currentOccupancyRate: number;
    thisMonthRevenue: number;
    previousMonthRevenue: number;
    revenueChange: number; // pourcentage
    upcomingReservations: number;
  }
  
  export interface StatisticsFilter {
    startDate: Date;
    endDate: Date;
    spaceTypes?: string[];
    compareWithPrevious?: boolean;
    groupBy?: 'day' | 'week' | 'month';
  }
  
  export interface SpaceTypeStatistics {
    type: string;
    totalReservations: number;
    occupancyRate: number;
    revenue: number;
    averageStay: number; // en jours
  }
  
  export interface MonthlyStatistics {
    month: string;
    occupancyRate: number;
    revenue: number;
    reservations: number;
    newClients: number;
  }
  
  export interface PeriodComparison {
    currentPeriod: {
      startDate: Date;
      endDate: Date;
    };
    previousPeriod: {
      startDate: Date;
      endDate: Date;
    };
    occupancyChange: number; // pourcentage
    revenueChange: number; // pourcentage
    reservationsChange: number; // pourcentage
    newClientsChange: number; // pourcentage
  }