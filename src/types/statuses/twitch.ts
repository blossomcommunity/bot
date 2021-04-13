export interface Root {
	page: Page;
	components: Component[];
	incidents: unknown[];
	scheduled_maintenances: unknown[];
	status: Status;
}

export interface Page {
	id: string;
	name: string;
	url: string;
	time_zone: string;
	updated_at: string;
}

export interface Component {
	id: string;
	name: string;
	status: string;
	created_at: string;
	updated_at: string;
	position: number;
	description: unknown;
	showcase: boolean;
	start_date?: string;
	group_id: unknown;
	page_id: string;
	group: boolean;
	only_show_if_degraded: boolean;
}

export interface Status {
	indicator: string;
	description: string;
}
