import SidebarMenu, {sidebarMenu} from "./SidebarMenu.astro";
import SidebarMenuButton, {sidebarMenuButton} from "./SidebarMenuButton.astro";
import SidebarMenuItem, {sidebarMenuItem} from "./SidebarMenuItem.astro";
import SidebarMenuSub, {sidebarMenuSub} from "./SidebarMenuSub.astro";
import SidebarMenuSubButton, {sidebarMenuSubButton} from "./SidebarMenuSubButton.astro";
import SidebarMenuSubItem, {sidebarMenuSubItem} from "./SidebarMenuSubItem.astro";

const SidebarVariants = {
	sidebarMenu,
	sidebarMenuButton,
	sidebarMenuItem,
	sidebarMenuSub,
	sidebarMenuSubButton,
	sidebarMenuSubItem
}

export {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarVariants
}
