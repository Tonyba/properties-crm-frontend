import { createBrowserRouter } from "react-router"

import loadable from "@loadable/component";

import App from "./App";

import { appLoader } from "./loaders/appLoader";
import { type QueryClient } from "@tanstack/react-query";
import type { RouterItem } from "./helpers/types";
import { leadAddLoader } from "./loaders/leadLoader";
import { leadDetailsLoader } from "./loaders/singleLeadLoader";
import { singleLoader } from "./loaders/SingleLoader";
import { get_contact } from "./api/contacts";
import AddContact from "./pages/contacts/ContactAdd";


type RouteItems = RouterItem[];

const DashboardPage = loadable(() => import("./pages/dashboard/DashboardPage"));

const PropertiesPage = loadable(() => import("./pages/properties/PropertiesPage"));

const MarketingPage = loadable(() => import("./pages/leads/LeadRoot"));
const LeadList = loadable(() => import("./pages/leads/LeadList"));
const AddLead = loadable(() => import("./pages/leads/LeadAdd"));

const LeadDetails = loadable(() => import('./pages/leads/LeadDetails'));
const LeadData = loadable(() => import('./pages/leads/LeadData'));
const LeadActivities = loadable(() => import('./pages/leads/LeadActivities'));
const LeadEmails = loadable(() => import('./pages/leads/LeadEmails'));
const LeadDocuments = loadable(() => import('./pages/leads/LeadDocuments'));
const LeadCampaigns = loadable(() => import('./pages/leads/LeadCampaigns'));
const LeadComments = loadable(() => import('./pages/leads/LeadComments'));
const LeadSummary = loadable(() => import('./pages/leads/LeadSummary'));

const ContactDetails = loadable(() => import('./pages/contacts/ContactDetails'));
const ContactList = loadable(() => import('./pages/contacts/ContactList'));
const ContactAdd = loadable(() => import('./pages/contacts/ContactAdd'));
const ContactSummary = loadable(() => import('./pages/contacts/ContactSummary'));
const ContactData = loadable(() => import('./pages/contacts/ContactData'));
const ContactUpdates = loadable(() => import('./pages/contacts/ContactUpdates'));
const ContactActivities = loadable(() => import('./pages/contacts/ContactActivities'));
const ContactEmails = loadable(() => import('./pages/contacts/ContactEmails'));
const ContactDocuments = loadable(() => import('./pages/contacts/ContactDocuments'));
const ContactCampaigns = loadable(() => import('./pages/contacts/ContactCampaigns'));
const ContactComments = loadable(() => import('./pages/contacts/ContactComments'))

const UpdatesTab = loadable(() => import('./pages/UpdatesTab'));



export const routesFn = (queryClient?: QueryClient) => {

    const contactLoader = queryClient && singleLoader(queryClient, get_contact, 'Contact');

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
                            path: 'leads/:id/details',
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
                                    Component: UpdatesTab
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
                            path: 'leads/:id/edit',
                            Component: AddLead,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                showTopHeader: false,
                            },
                        },
                        {
                            path: 'contacts',
                            label: 'Contacts',
                            Component: ContactList,
                            headerProps: {
                                moduleSingle: 'Contact',
                                importBtn: true,
                                filter: true,
                                showCreateBtn: true
                            }
                        },
                        {
                            label: 'Add Contact',
                            path: 'contacts/add',
                            Component: ContactAdd,
                            loader: queryClient && leadAddLoader(queryClient),
                            headerProps: {
                                isCreate: true,
                                showCreateBtn: false,
                            }
                        },
                        {
                            label: 'Contact Details',
                            path: 'contacts/:id/details',
                            Component: ContactDetails,
                            loader: contactLoader,
                            headerProps: {
                                showCreateBtn: false,
                                moduleSingle: 'Contact'
                            },
                            children: [
                                {
                                    index: true,
                                    label: 'Summary',
                                    Component: ContactSummary,
                                },
                                {
                                    label: 'Details',
                                    path: 'data',
                                    Component: ContactData
                                },
                                {
                                    label: 'Updates',
                                    path: 'updates',
                                    Component: UpdatesTab
                                },
                                {
                                    label: 'Activities',
                                    path: 'activities',
                                    Component: ContactActivities
                                },
                                {
                                    label: 'Emails',
                                    path: 'emails',
                                    Component: ContactEmails
                                },
                                {
                                    label: 'Documents',
                                    path: 'documents',
                                    Component: ContactDocuments
                                },
                                {
                                    label: 'Campaigns',
                                    path: 'campaigns',
                                    Component: ContactCampaigns
                                },
                                {
                                    label: 'Comments',
                                    path: 'comments',
                                    Component: ContactComments
                                },
                            ]
                        },
                        {
                            label: 'Edit Contact',
                            path: 'contacts/:id/edit',
                            Component: AddContact,
                            headerProps: {
                                showTopHeader: false,
                            },
                        },
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


