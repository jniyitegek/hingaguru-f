import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: "Dashboard - Hingaguru",
  description: "A glimpse into everything",
};

export default function HingaguruDashboard() {
    return <DashboardClient />;
}