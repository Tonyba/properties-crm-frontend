import { createBrowserRouter } from "react-router"

import loadable from "@loadable/component";

import App from "./App";

import { appLoader } from "./loaders/appLoader";
import { type QueryClient } from "@tanstack/react-query";
import type { RouterItem } from "./helpers/types";
import { leadAddLoader } from "./loaders/leadLoader";
import { leadDetailsLoader } from "./loaders/singleLeadLoader";
import { singleLoader } from "./loaders/singleLoader";
import { get_contact } from "./api/contacts";
import AddContact from "./pages/contacts/ContactAdd";
import { get_opportunity } from "./api/opportunities";
import OpportunityDetails from "./pages/opportunities/OpportunityDetails";
import OpportunitySummary from "./pages/opportunities/OpportunitySummary";
import OpportunityData from "./pages/opportunities/OpportunityData";
import EmailsTab from "./pages/EmailsTab";
import TabComments from "./pages/TabComments";


type RouteItems = RouterItem[];

const DashboardPage = loadable(() => import("./pages/dashboard/DashboardPage"));
const PropertiesPage = loadable(() => import("./pages/properties/PropertiesPage"));
const LoginPage = loadable(() => import("./pages/login/LoginPage"));

// Marketing Module
const MarketingPage = loadable(() => import("./pages/leads/LeadRoot"));
const LeadList = loadable(() => import("./pages/leads/LeadList"));
const AddLead = loadable(() => import("./pages/leads/LeadAdd"));

const LeadDetails = loadable(() => import('./pages/leads/LeadDetails'));
const LeadData = loadable(() => import('./pages/leads/LeadData'));
const LeadEmails = loadable(() => import('./pages/leads/LeadEmails'));
const LeadCampaigns = loadable(() => import('./pages/leads/LeadCampaigns'));
const LeadComments = loadable(() => import('./pages/leads/LeadComments'));
const LeadSummary = loadable(() => import('./pages/leads/LeadSummary'));

const ContactDetails = loadable(() => import('./pages/contacts/ContactDetails'));
const ContactList = loadable(() => import('./pages/contacts/ContactList'));
const ContactAdd = loadable(() => import('./pages/contacts/ContactAdd'));
const ContactSummary = loadable(() => import('./pages/contacts/ContactSummary'));
const ContactData = loadable(() => import('./pages/contacts/ContactData'));
const ContactEmails = loadable(() => import('./pages/contacts/ContactEmails'));
const ContactCampaigns = loadable(() => import('./pages/contacts/ContactCampaigns'));
const ContactComments = loadable(() => import('./pages/contacts/ContactComments'))

// Opportunities Module
const SalesPage = loadable(() => import("./pages/opportunities/OpportunityRoot"));
const OpportunityList = loadable(() => import("./pages/opportunities/OpportunityList"));
const OpportunityAdd = loadable(() => import("./pages/opportunities/OpportunityAdd"));

// Detail Tabs

const UpdatesTab = loadable(() => import('./pages/UpdatesTab'));
const ActivitiesTab = loadable(() => import('./pages/ActivitiesTab'));
const DocumentsTab = loadable(() => import('./pages/DocumentsTab'));


export const routesFn = (queryClient?: QueryClient) => {

    const contactLoader = queryClient && singleLoader(queryClient, get_contact, 'Contact');
    const OpportunityLoader = queryClient && singleLoader(queryClient, get_opportunity, 'Opportunity');

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
                                moduleSingle: 'Leads',
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
                                    Component: ActivitiesTab
                                },
                                {
                                    label: 'Emails',
                                    path: 'emails',
                                    Component: LeadEmails
                                },
                                {
                                    label: 'Documents',
                                    path: 'documents',
                                    Component: DocumentsTab
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
                                    Component: ActivitiesTab
                                },
                                {
                                    label: 'Emails',
                                    path: 'emails',
                                    Component: ContactEmails
                                },
                                {
                                    label: 'Documents',
                                    path: 'documents',
                                    Component: DocumentsTab
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

                },
                {
                    path: '/sales',
                    label: 'Sales',
                    Component: SalesPage,
                    children: [
                        {
                            index: true,
                            label: 'Opportunities',
                            Component: OpportunityList,
                            headerProps: {
                                moduleSingle: 'Opportunity',
                                importBtn: true,
                                filter: true,
                                showCreateBtn: true,
                                showViewSwitcher: true
                            }
                        },
                        {
                            label: 'Opportunity Details',
                            path: 'opportunity/:id/details',
                            loader: queryClient && OpportunityLoader,
                            Component: OpportunityDetails,
                            headerProps: {
                                showCreateBtn: true,
                                moduleSingle: 'Opportunity'
                            },
                            children: [
                                {
                                    index: true,
                                    label: 'Summary',
                                    Component: OpportunitySummary,
                                },
                                {
                                    label: 'Details',
                                    path: 'data',
                                    Component: OpportunityData
                                },
                                {
                                    label: 'Updates',
                                    path: 'updates',
                                    Component: UpdatesTab
                                },
                                {
                                    label: 'Activities',
                                    path: 'activities',
                                    Component: ActivitiesTab
                                },
                                {
                                    label: 'Emails',
                                    path: 'emails',
                                    Component: EmailsTab
                                },
                                {
                                    label: 'Documents',
                                    path: 'documents',
                                    Component: DocumentsTab
                                },
                                {
                                    label: 'Commments',
                                    path: 'comments',
                                    Component: TabComments
                                },
                            ]
                        },
                        {
                            label: 'Add Opportunity',
                            path: 'opportunity/add',
                            Component: OpportunityAdd,
                            headerProps: {
                                isCreate: true,
                                showCreateBtn: false,
                                moduleSingle: 'Opportunity',
                            }
                        },
                        {
                            label: 'Edit Opportunity',
                            path: 'opportunity/:id/edit',
                            Component: OpportunityAdd,
                            loader: queryClient && OpportunityLoader,
                            headerProps: {
                                showTopHeader: false,
                            },
                        },
                    ]
                }
            ]
        },
        {
            path: '/login',
            Component: LoginPage
        }
    ];

    if (queryClient) {
        routerItems[0].loader = appLoader(queryClient)!;
    }

    const router = createBrowserRouter(routerItems);

    return { router, routerItems };
}


