/**
 * Test Charts - Very simple component to test data display
 */

import React, { Component } from 'react';

export class TestCharts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blockData: null,
			txData: null,
			loading: true,
			error: null
		};
	}

	componentDidMount() {
		console.log('TestCharts - Component mounted');
		this.loadData();
	}

	loadData = async () => {
		console.log('TestCharts - Loading data...');
		this.setState({ loading: true, error: null });

		try {
			// Test with hardcoded data first
			const testBlockData = {
				status: 200,
				row: [
					{
						blocknum: 6,
						txcount: 1,
						createdt: '2025-08-03T10:20:02.133Z'
					},
					{
						blocknum: 5,
						txcount: 1,
						createdt: '2025-08-03T10:19:35.208Z'
					}
				]
			};

			const testTxData = {
				status: 200,
				rows: [
					{ count: '2', creator_msp_id: 'OrdererMSP' },
					{ count: '2', creator_msp_id: 'Org1MSP' },
					{ count: '2', creator_msp_id: 'Org2MSP' }
				]
			};

			console.log('TestCharts - Using test data:', { testBlockData, testTxData });

			this.setState({
				blockData: testBlockData.row,
				txData: testTxData.rows,
				loading: false
			});

			// Now try real API call
			try {
				const response = await fetch('/api/blockActivity/mychannel');
				const realData = await response.json();
				console.log('TestCharts - Real API response:', realData);

				if (realData.status === 200) {
					this.setState({
						blockData: realData.row,
						loading: false
					});
				}
			} catch (apiError) {
				console.error('TestCharts - API error:', apiError);
				this.setState({
					error: 'API call failed: ' + apiError.message,
					loading: false
				});
			}
		} catch (error) {
			console.error('TestCharts - Error:', error);
			this.setState({
				error: 'Failed to load data: ' + error.message,
				loading: false
			});
		}
	};

	render() {
		const { blockData, txData, loading, error } = this.state;

		console.log('TestCharts - Rendering with state:', {
			blockData,
			txData,
			loading,
			error
		});

		return (
			<div
				style={{
					padding: '20px',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px',
					margin: '10px',
					border: '3px solid red'
				}}
			>
				<h2 style={{ color: '#333', textAlign: 'center' }}>
					Test Charts - Data Display
				</h2>

				{loading && (
					<div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
						Loading data...
					</div>
				)}

				{error && (
					<div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>
						Error: {error}
					</div>
				)}

				{!loading && !error && (
					<div>
						{/* Block Activity */}
						<div style={{ marginBottom: '30px' }}>
							<h3 style={{ color: '#333', marginBottom: '15px' }}>
								Block Activity Test
							</h3>
							{blockData && blockData.length > 0 ? (
								<div>
									{blockData.map((block, index) => (
										<div
											key={index}
											style={{
												backgroundColor: '#fff',
												padding: '15px',
												margin: '10px 0',
												borderRadius: '8px',
												border: '1px solid #ddd',
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<div>
												<strong>Block #{block.blocknum}</strong>
												<br />
												<small style={{ color: '#666' }}>
													{new Date(block.createdt).toLocaleString()}
												</small>
											</div>
											<div
												style={{
													backgroundColor: '#4CAF50',
													color: 'white',
													padding: '8px 16px',
													borderRadius: '20px',
													fontWeight: 'bold'
												}}
											>
												{block.txcount} TX
											</div>
										</div>
									))}
								</div>
							) : (
								<div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
									No block data available
								</div>
							)}
						</div>

						{/* Transaction by Organization */}
						<div>
							<h3 style={{ color: '#333', marginBottom: '15px' }}>
								Transactions by Organization Test
							</h3>
							{txData && txData.length > 0 ? (
								<div>
									{txData.map((org, index) => (
										<div
											key={index}
											style={{
												backgroundColor: '#fff',
												padding: '15px',
												margin: '10px 0',
												borderRadius: '8px',
												border: '1px solid #ddd',
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<div>
												<strong>{org.creator_msp_id}</strong>
											</div>
											<div
												style={{
													backgroundColor: '#FF9800',
													color: 'white',
													padding: '8px 16px',
													borderRadius: '20px',
													fontWeight: 'bold'
												}}
											>
												{org.count} TX
											</div>
										</div>
									))}
								</div>
							) : (
								<div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
									No transaction data available
								</div>
							)}
						</div>
					</div>
				)}

				<button
					onClick={this.loadData}
					style={{
						backgroundColor: '#2196F3',
						color: 'white',
						border: 'none',
						padding: '10px 20px',
						borderRadius: '4px',
						cursor: 'pointer',
						marginTop: '20px',
						width: '100%'
					}}
				>
					Refresh Data
				</button>
			</div>
		);
	}
}

export default TestCharts;
