import { createBrowserRouter } from "react-router"

import loadable from "@loadable/component";

import App from "./App";

import { appLoader } from "./loaders/appLoader";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { RouterItem } from "./helpers/types";
import { leadAddLoader } from "./loaders/leadLoader";
import { use } from "react";


type RouteItems = RouterItem[];

const DashboardPage = loadable(() => import("./pages/dashboard/DashboardPage"));

const PropertiesPage = loadable(() => import("./pages/properties/PropertiesPage"));

const MarketingPage = loadable(() => import("./pages/leads/LeadRoot"));
const LeadList = loadable(() => import("./pages/leads/LeadList"));
const AddLead = loadable(() => import("./pages/leads/LeadAdd"));


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
                            }
                        },
                        {
                            label: 'Add Lead',
                            path: 'leads/add',
                            Component: AddLead,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                showTopHeader: false,
                                isCreate: true
                            },
                        },
                        {
                            label: 'Edit Lead',
                            path: 'leads/:leadId/edit',
                            Component: AddLead,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                showTopHeader: false,
                                isCreate: true
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


