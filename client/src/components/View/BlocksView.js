/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Block, Receipt, Timer, Close } from '@mui/icons-material';
import SimpleDataTable from '../DataTable/SimpleDataTable';
import { tableSelectors, tableOperations } from '../../state/redux/tables';

const BlocksView = ({
  blockListSearch = [],
  loading = false,
  getBlockListSearch,
  currentChannel = 'mychannel'
}) => {
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    if (currentChannel) {
      getBlockListSearch(currentChannel, '', { page: 1, size: 100 });
    }
  }, [getBlockListSearch, currentChannel]);

  const blockColumns = [
    {
      field: 'blocknum',
      headerName: 'Block Number',
      width: 150,
      type: 'chip',
      getChipColor: () => 'primary'
    },
    {
      field: 'blockhash',
      headerName: 'Data Hash',
      width: 300,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
        >
          {value?.substring(0, 20)}...
        </Typography>
      )
    },
    {
      field: 'txcount',
      headerName: 'Transactions',
      width: 120,
      type: 'number'
    },
    {
      field: 'createdt',
      headerName: 'Created',
      width: 200,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(value).toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'prehash',
      headerName: 'Previous Hash',
      width: 300,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
        >
          {value?.substring(0, 20)}...
        </Typography>
      )
    }
  ];

  const handleRowClick = row => {
    setSelectedBlock(row);
  };

  const handleCloseModal = () => {
    setSelectedBlock(null);
  };

  const handleRefresh = () => {
    if (currentChannel) {
      getBlockListSearch(currentChannel, '', { page: 1, size: 100 });
    }
  };

  const stats = [
    {
      title: 'Total Blocks',
      value: blockListSearch.length || 0,
      icon: <Block />,
      color: '#3b82f6'
    },
    {
      title: 'Total Transactions',
      value: blockListSearch.reduce(
        (sum, block) => sum + (block.txcount || 0),
        0
      ),
      icon: <Receipt />,
      color: '#10b981'
    },
    {
      title: 'Latest Block',
      value: blockListSearch.length > 0 ? blockListSearch[0].blocknum : 0,
      icon: <Timer />,
      color: '#f59e0b'
    }
  ];

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Blocks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and explore blockchain blocks
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <div
              className="stat-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}20`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${stat.color}20`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>

      {/* Blocks Table */}
      <Box sx={{ height: 'calc(100% - 200px)' }}>
        <SimpleDataTable
          title="Blockchain Blocks"
          data={blockListSearch}
          columns={blockColumns}
          loading={loading}
          onRefresh={handleRefresh}
          onRowClick={handleRowClick}
          getRowId={row => row.blocknum}
          pageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Box>

      {/* Block Details Modal */}
      <Dialog
        open={!!selectedBlock}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">
              Block #{selectedBlock?.blocknum} Details
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBlock && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Block Number
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: 'monospace', mb: 2 }}
                  >
                    {selectedBlock.blocknum}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Transactions
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBlock.txcount}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(selectedBlock.createdt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Block Hash
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      mb: 2,
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedBlock.blockhash}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Previous Hash
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      mb: 2,
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedBlock.prehash}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const { blockListSearchSelector } = tableSelectors;
const { blockListSearch } = tableOperations;

const mapStateToProps = state => ({
  blockListSearch: blockListSearchSelector(state),
  loading: false // Add proper loading selector
});

const mapDispatchToProps = {
  getBlockListSearch: blockListSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(BlocksView);
