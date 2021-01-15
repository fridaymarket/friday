export interface IRenderService {
	bootstrap(): Promise<void>
	mount(props: any): Promise<void>
	unmount(props: any): Promise<void>
	render(): void
}
