import { createBrowserRouter } from "react-router"

import loadable from "@loadable/component";

import App from "./App";

import { appLoader } from "./loaders/appLoader";
import { type QueryClient } from "@tanstack/react-query";
import type { RouterItem } from "./helpers/types";
import { leadAddLoader } from "./loaders/leadLoader";
import { leadDetailsLoader } from "./loaders/leadDetailsLoader";


type RouteItems = RouterItem[];

const DashboardPage = loadable(() => import("./pages/dashboard/DashboardPage"));

const PropertiesPage = loadable(() => import("./pages/properties/PropertiesPage"));

const MarketingPage = loadable(() => import("./pages/leads/LeadRoot"));
const LeadList = loadable(() => import("./pages/leads/LeadList"));
const AddLead = loadable(() => import("./pages/leads/LeadAdd"));

const LeadDetails = loadable(() => import('./pages/leads/LeadDetails'));
const LeadData = loadable(() => import('./pages/leads/LeadData'));
const LeadUpdates = loadable(() => import('./pages/leads/LeadUpdates'));
const LeadActivities = loadable(() => import('./pages/leads/LeadActivities'));
const LeadEmails = loadable(() => import('./pages/leads/LeadEmails'));
const LeadDocuments = loadable(() => import('./pages/leads/LeadDocuments'));
const LeadCampaigns = loadable(() => import('./pages/leads/LeadCampaigns'));
const LeadComments = loadable(() => import('./pages/leads/LeadComments'));
const LeadSummary = loadable(() => import('./pages/leads/LeadSummary'));


export const routesFn = (queryClient?: QueryClient) => {

    const routerItems: RouteItems = [
        {
            path: '/',
            Component: App,
            children: [
                {
                    index: true,
                    Component: DashboardPage,
                    label: 'Dashboard',
                },
                {
                    path: '/properties',
                    label: 'Properties',
                    Component: PropertiesPage
                },
                {
                    path: '/marketing',
                    label: 'Marketing',
                    Component: MarketingPage,
                    children: [
                        {
                            index: true,
                            label: 'Leads',
                            Component: LeadList,
                            headerProps: {
                                moduleSingle: 'Lead',
                                importBtn: true,
                                filter: true,
                                showCreateBtn: true
                            }
                        },
                        {
                            label: 'Add Lead',
                            path: 'leads/add',
                            Component: AddLead,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                isCreate: true,
                                showCreateBtn: false,
                            }
                        },
                        {
                            label: 'Lead Details',
                            path: 'leads/:leadId/details',
                            loader: queryClient && leadDetailsLoader(queryClient),
                            Component: LeadDetails,
                            headerProps: {
                                showCreateBtn: true,
                                moduleSingle: 'Lead'
                            },
                            children: [
                                {
                                    index: true,
                                    label: 'Summary',
                                    Component: LeadSummary,
                                },
                                {
                                    label: 'Details',
                                    path: 'data',
                                    Component: LeadData
                                },
                                {
                                    label: 'Updates',
                                    path: 'updates',
                                    Component: LeadUpdates
                                },
                                {
                                    label: 'Activities',
                                    path: 'activities',
                                    Component: LeadActivities
                                },
                                {
                                    label: 'Emails',
                                    path: 'emails',
                                    Component: LeadEmails
                                },
                                {
                                    label: 'Documents',
                                    path: 'documents',
                                    Component: LeadDocuments
                                },
                                {
                                    label: 'Campaigns',
                                    path: 'campaigns',
                                    Component: LeadCampaigns
                                },
                                {
                                    label: 'Comments',
                                    path: 'comments',
                                    Component: LeadComments
                                },
                            ]
                        },
                        {
                            label: 'Edit Lead',
                            path: 'leads/:leadId/edit',
                            Component: AddLead,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                showTopHeader: false,
                            },
                        }
                    ],
                }
            ]
        },
    ];

    if (queryClient) {
        routerItems[0].loader = appLoader(queryClient)!;
    }

    const router = createBrowserRouter(routerItems);

    return { router, routerItems };
}


