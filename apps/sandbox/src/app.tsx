import { AppShell, Header, MantineTheme, Navbar } from '@mantine/core';
import GameView from './components/GameView';

export function App() {
	return (
		<>
			<AppShell
				padding='md'
				navbar={
					<Navbar width={{ base: 300 }} p='xs'>
						{/* Navbar content */}
					</Navbar>
				}
				header={
					<Header height={60} p='xs'>
						OpenSorcery🧙‍♂️
					</Header>
				}
				styles={(theme: MantineTheme) => ({
					main: {
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					},
				})}
			>
				{/* Your application here */}
				<GameView />
			</AppShell>
		</>
	);
}
