import * as React from "react";
import { 
  Command as CommandPrimitive,
  CommandInput as InputPrimitive,
  CommandList as ListPrimitive,
  CommandEmpty as EmptyPrimitive,
  CommandGroup as GroupPrimitive,
  CommandItem as ItemPrimitive,
  CommandSeparator as SeparatorPrimitive,
} from "cmdk";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  React.ComponentPropsWithoutRef<typeof InputPrimitive>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <InputPrimitive
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = InputPrimitive.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof ListPrimitive>,
  React.ComponentPropsWithoutRef<typeof ListPrimitive>
>(({ className, ...props }, ref) => (
  <ListPrimitive
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = ListPrimitive.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof EmptyPrimitive>,
  React.ComponentPropsWithoutRef<typeof EmptyPrimitive>
>(({ ...props }, ref) => (
  <EmptyPrimitive
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = EmptyPrimitive.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof GroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof GroupPrimitive>
>(({ className, ...props }, ref) => (
  <GroupPrimitive
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = GroupPrimitive.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof ItemPrimitive>,
  React.ComponentPropsWithoutRef<typeof ItemPrimitive>
>(({ className, ...props }, ref) => (
  <ItemPrimitive
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = ItemPrimitive.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = SeparatorPrimitive.displayName;

const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandDialog,
};
